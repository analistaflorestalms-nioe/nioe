/**
 * Serviço de Ingestão RSS - NIOE
 * Coleta automática de notícias com análise de relevância
 */

const Parser = require('rss-parser');
const cron = require('node-cron');
const { Noticia } = require('../models');
const logger = require('../utils/logger');

class RSSIngestionService {
  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'NIOE RSS Reader 1.0'
      }
    });

    // URLs RSS das fontes de notícias
    this.sources = [
      {
        name: 'G1',
        url: 'https://g1.globo.com/rss/g1/',
        categoria: 'geral'
      },
      {
        name: 'UOL',
        url: 'https://rss.uol.com.br/feed/noticias.xml',
        categoria: 'geral'
      },
      {
        name: 'Band',
        url: 'https://www.band.uol.com.br/rss/noticias.xml',
        categoria: 'geral'
      },
      {
        name: 'InfoMoney',
        url: 'https://www.infomoney.com.br/feed/',
        categoria: 'economia'
      },
      {
        name: 'Valor Econômico',
        url: 'https://valor.globo.com/rss/',
        categoria: 'economia'
      },
      {
        name: 'TecMundo',
        url: 'https://rss.tecmundo.com.br/feed',
        categoria: 'tecnologia'
      }
    ];

    // Palavras-chave para análise de relevância
    this.keywords = {
      alta: [
        'incêndio', 'incendio', 'fogo', 'queimada', 'bombeiros',
        'emergência', 'emergencia', 'acidente', 'segurança', 'seguranca',
        'porto', 'santos', 'celulose', 'floresta', 'ambiental',
        'bracell', 'ms florestal', 'eucalipto'
      ],
      media: [
        'indústria', 'industria', 'economia', 'logística', 'logistica',
        'transporte', 'infraestrutura', 'sustentabilidade',
        'meio ambiente', 'greve', 'sindicato', 'trabalhador'
      ],
      baixa: [
        'política', 'politica', 'eleição', 'eleicao', 'governo',
        'covid', 'saúde', 'saude', 'educação', 'educacao'
      ]
    };

    this.categorizeKeywords = {
      incendio: ['incêndio', 'incendio', 'fogo', 'queimada', 'bombeiros'],
      seguranca: ['segurança', 'seguranca', 'acidente', 'emergência', 'emergencia'],
      ambiental: ['ambiental', 'meio ambiente', 'sustentabilidade', 'floresta'],
      logistica: ['logística', 'logistica', 'transporte', 'porto', 'santos'],
      economia: ['economia', 'econômico', 'economico', 'mercado', 'indústria', 'industria'],
      tecnologia: ['tecnologia', 'digital', 'inovação', 'inovacao', 'tech']
    };
  }

  // Analisar relevância do conteúdo
  analyzeRelevance(title, content) {
    const text = (title + ' ' + (content || '')).toLowerCase();
    
    for (const keyword of this.keywords.alta) {
      if (text.includes(keyword)) {
        return 'alta';
      }
    }
    
    for (const keyword of this.keywords.media) {
      if (text.includes(keyword)) {
        return 'media';
      }
    }
    
    return 'baixa';
  }

  // Categorizar notícia
  categorizeNews(title, content) {
    const text = (title + ' ' + (content || '')).toLowerCase();
    
    for (const [categoria, keywords] of Object.entries(this.categorizeKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return categoria;
        }
      }
    }
    
    return 'geral';
  }

  // Extrair tags relevantes
  extractTags(title, content) {
    const text = (title + ' ' + (content || '')).toLowerCase();
    const tags = [];
    
    // Verificar todas as palavras-chave
    for (const keywords of Object.values(this.keywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword) && !tags.includes(keyword)) {
          tags.push(keyword);
        }
      }
    }
    
    return tags;
  }

  // Processar feed RSS
  async processFeed(source) {
    try {
      logger.info(`RSS_FEED_START: Processando feed ${source.name} - ${source.url}`);
      
      const feed = await this.parser.parseURL(source.url);
      
      let processados = 0;
      let salvos = 0;
      let duplicados = 0;
      let erros = 0;

      for (const item of feed.items) {
        try {
          processados++;
          
          // Verificar se a notícia já existe
          const existingNews = await Noticia.findOne({
            where: { url: item.link }
          });

          if (existingNews) {
            duplicados++;
            continue;
          }

          // Analisar relevância e categoria
          const relevancia = this.analyzeRelevance(item.title, item.contentSnippet);
          const categoria = this.categorizeNews(item.title, item.contentSnippet);
          const tags = this.extractTags(item.title, item.contentSnippet);

          // Criar notícia
          await Noticia.create({
            titulo: item.title,
            resumo: item.contentSnippet || '',
            conteudo: item.content || item.contentSnippet || '',
            url: item.link,
            fonte: source.name,
            autor: item.creator || item['dc:creator'] || null,
            data_publicacao: new Date(item.pubDate || item.isoDate),
            categoria,
            relevancia,
            tags,
            processada: true
          });

          salvos++;
          
        } catch (error) {
          erros++;
          logger.error(`Erro ao processar item do feed ${source.name}:`, error.message);
        }
      }

      logger.info(`RSS_FEED_COMPLETE: ${source.name} - Processados: ${processados}, Salvos: ${salvos}, Duplicados: ${duplicados}, Erros: ${erros}`);
      
      return { processados, salvos, duplicados, erros };

    } catch (error) {
      logger.error(`Erro ao processar feed ${source.name}:`, error);
      return { processados: 0, salvos: 0, duplicados: 0, erros: 1 };
    }
  }

  // Executar ingestão de todas as fontes
  async runIngestion() {
    try {
      logger.info('RSS_INGESTION_START: Iniciando ingestão de notícias RSS');
      
      const results = [];
      
      for (const source of this.sources) {
        const result = await this.processFeed(source);
        results.push({
          fonte: source.name,
          ...result
        });
      }

      const totals = results.reduce((acc, curr) => ({
        processados: acc.processados + curr.processados,
        salvos: acc.salvos + curr.salvos,
        duplicados: acc.duplicados + curr.duplicados,
        erros: acc.erros + curr.erros
      }), { processados: 0, salvos: 0, duplicados: 0, erros: 0 });

      logger.info(`RSS_INGESTION_COMPLETE: TOTAL - Processados: ${totals.processados}, Salvos: ${totals.salvos}, Duplicados: ${totals.duplicados}, Erros: ${totals.erros}`);
      
      return results;

    } catch (error) {
      logger.error('Erro na ingestão RSS:', error);
      throw error;
    }
  }

  // Iniciar serviço com cron job
  start() {
    // Executar imediatamente com delay de 5 segundos
    setTimeout(() => {
      this.runIngestion().catch(error => {
        logger.error('Erro na execução inicial do RSS:', error);
      });
    }, 5000);

    // Executar a cada 30 minutos
    cron.schedule('*/30 * * * *', () => {
      this.runIngestion().catch(error => {
        logger.error('Erro na execução agendada do RSS:', error);
      });
    });

    logger.info('🔄 Serviço RSS iniciado - execução a cada 30 minutos');
  }
}

module.exports = RSSIngestionService;
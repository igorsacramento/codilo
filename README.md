## Configurações no arquivo de Danco de Dados
Mongo = CONNECT_MONGO_DB_KEY //String de Conexão\
MySQL = CONNECT_MYSQL_DB_KEY //String de Conexão\

## Script para criação de table do Banco de Dados MySQL
CREATE TABLE `resquests` (\
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,\
  `request_type` varchar(5) COLLATE utf8_unicode_ci DEFAULT 'POST',\
  `param_request` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,\
  `response` longtext COLLATE utf8_unicode_ci,\
  `finalized` tinyint(4) DEFAULT '0',\
  `created_at` datetime DEFAULT NULL,\
  `finalized_at` datetime DEFAULT '0000-00-00 00:00:00',\
  PRIMARY KEY (`ID`),\
  UNIQUE KEY `ID_UNIQUE` (`ID`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci\

# 🧠 Evilink  
## Principios y Arquitectura del Ecosistema  
### (Ingesta de Nexus)

---

## 1. Propósito del documento

Este documento define los **principios técnicos y arquitectónicos** que rigen todo el ecosistema **Evilink**.

Su función es:

- Evitar decisiones improvisadas  
- Controlar costos en etapa temprana  
- Permitir escalar sin reescrituras  
- Mantener coherencia entre productos  
- Servir como referencia única de diseño  

**Toda nueva API, servicio o producto debe alinearse a este documento.**

---

## 2. Principios fundamentales

### 2.1 Un solo ecosistema, múltiples productos
Evilink no es una app única, es un **ecosistema de APIs y servicios** con identidad propia, pero reglas comunes.

---

### 2.2 Elegir stack por peso, no por preferencia
El stack se elige según **qué hace el servicio**, no por comodidad.

- Flujos ligeros → stacks ligeros  
- Flujos pesados → stacks robustos  

---

### 2.3 No duplicar versiones
No se crean “versiones paralelas” del mismo producto solo para ahorrar costos.

Se optimiza:
- configuración  
- arquitectura  
- rol de cada componente  

---

### 2.4 Seguridad desde el MVP
La seguridad no se posterga.  
Se **simplifica**, pero no se elimina.

---

### 2.5 Contratos antes que implementación
Los servicios se integran por **contratos**, no por conocimiento interno.

---

## 3. Rol de Nexus (Ingesta)

### 3.1 Qué es Nexus
**Nexus es la capa de ingesta y gobierno del ecosistema Evilink.**

Es el punto de entrada unificado para:
- usuarios  
- clientes  
- APIs externas  
- paneles y dashboards  

---

### 3.2 Qué SÍ hace Nexus
- Gateway / BFF (Backend for Frontend)  
- Autenticación y autorización  
- Gestión de API Keys  
- Rate limiting básico  
- Validación de requests  
- Enrutamiento hacia servicios internos  
- Exposición controlada de APIs  
- UI, docs, demos y dashboards  

---

### 3.3 Qué NO hace Nexus
Nexus **no ejecuta lógica pesada** ni procesamiento intensivo:

- Jobs batch  
- Pipelines de datos  
- Scraping  
- IA pesada  
- Scoring complejo  
- Análisis masivo  
- Cachés grandes en memoria  

Esto es intencional para:
- reducir costos  
- evitar cuellos de botella  
- mantener estabilidad  

---

## 4. Arquitectura por capas

### 🟢 Capa 1 – Presentación e Ingesta
**Responsabilidad:** entrada, control y experiencia

**Stack principal:**
- Next.js

**Incluye:**
- Web Evilink  
- Dashboards  
- API Gateway  
- Auth ligera  
- Validaciones  
- Proxy hacia servicios core  

---

### 🔵 Capa 2 – Servicios Core (Motores)
**Responsabilidad:** lógica de negocio y procesamiento

**Stacks recomendados:**
- Spring Boot → robustez, contratos, control  
- Python (FastAPI / jobs) → datos, análisis, IA, trends  

**Ejemplos:**
- CryptoLink  
- API de Conciencia para IA  
- Social_Link  
- Data_Link  
- Servicios futuros de análisis  

---

### ⚙️ Capa 3 – Workers / Pipelines
**Responsabilidad:** trabajo asíncrono y pesado

- Jobs  
- Ingesta de datos  
- Normalización  
- Ranking  
- Evaluaciones offline  

Se mantienen **aislados del tráfico directo**.

---

## 5. Contratos y comunicación

Todo servicio debe exponer:
- OpenAPI / Swagger  
- Versionado explícito (`v1`, `v2`)  
- Esquemas claros de request/response  
- Errores normalizados  

**Nexus consume contratos, no dependencias internas.**

---

## 6. Seguridad mínima obligatoria

Desde el inicio:
- API Keys o JWT  
- Rate limiting por plan  
- Secrets en variables de entorno  
- Separación por producto  
- Nada hardcodeado  

Seguridad sencilla, pero consistente.

---

## 7. Observabilidad mínima

Todo servicio debe permitir:
- Identificar requests  
- Logs estructurados  
- Nivel INFO por default  
- Errores claros y trazables  

No APM complejo al inicio, sí **control y visibilidad**.

---

## 8. Estrategia de costos

- Nexus optimizado y ligero  
- Servicios pesados solo cuando se necesitan  
- Scale-to-zero / sleep cuando aplique  
- Separación clara para evitar gasto innecesario  

**Optimizar primero, escalar después.**

---

## 9. Visión a 12 meses

Este modelo permite:
- crecimiento ordenado  
- integración de nuevos productos sin caos  
- independencia entre servicios  
- estabilidad operativa  
- escalamiento progresivo  

---

## 10. Regla final

> Si un nuevo producto no encaja en esta arquitectura,  
> el problema no es la arquitectura:  
> **es el diseño del producto.**

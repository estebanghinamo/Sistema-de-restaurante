<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=2600&pause=900&color=8A7FFF&center=true&vCenter=true&width=820&lines=Ristorino;Plataforma+de+reservas+gastron%C3%B3micas;Microservicios+REST+%2B+SOAP+%C2%B7+Angular+%2B+Spring+Boot+%C2%B7+IA+(Gemini)" alt="Typing SVG" />

<a href="https://github.com/estebanghinamo"><img src="https://img.shields.io/badge/⬅_Perfil-181717?style=for-the-badge&logo=github&logoColor=white" alt="Perfil"/></a>

</div>

---

### 🍽️ Sobre el proyecto

**Ristorino** es una plataforma web de reservas y promoción de restaurantes. Integra una **arquitectura de microservicios** que combina **REST y SOAP** para conectar **4 restaurantes** externos en una única plataforma, resolviendo la heterogeneidad de sus sistemas de origen.

Trabajo en equipo de **3 personas**, con sprints Scrum de 12 semanas.

- 🧭 **Frontend en Angular**: exploración de restaurantes y promociones, gestión de reservas, sesiones seguras, diseño responsivo y **soporte multilenguaje (i18n)**.
- ⚙️ **Backend en Spring Boot** (Java 17): lógica de negocio, autenticación, CRUD de restaurantes/promociones/turnos, manejo global de excepciones y validaciones.
- 🔌 **Integración de servicios externos**: Ristorino consume, para cada restaurante, un servicio **REST** o un servicio **SOAP** (WSDL, con payloads JSON stringificados como wrapper) que simulan el sistema interno de ese local y exponen menú, promociones y disponibilidad en tiempo real.
- 🤖 **IA generativa (Google Gemini)**: generación automática de promociones atractivas y un **motor de búsqueda semántica** que interpreta consultas en lenguaje natural (no solo palabras clave) para explorar restaurantes.
- ⭐ Funcionalidades de producto: reservas, promociones, ranking, recomendaciones, favoritos y feedback.
- 🗄️ Procedimientos almacenados avanzados en **SQL Server** para la lógica de disponibilidad y reservas.

---

### 🛠️ Stack

<div align="center">
<img src="https://skillicons.dev/icons?i=angular,ts,java,spring,mysql,git,github,vscode,idea&perline=9" alt="tech stack"/>
</div>

![SOAP](https://img.shields.io/badge/SOAP-WSDL-0057A0?style=for-the-badge)
![REST](https://img.shields.io/badge/REST-API-009688?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-886FBF?style=for-the-badge&logo=googlegemini&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

---

### 🧩 Arquitectura

Ristorino está organizado como un **monorepo de microservicios**, uno por cada pieza del ecosistema:

```text
Sistema-de-restaurante/
├── Ristorino-Angular/     # Frontend — UI, reservas, i18n, búsqueda con IA
├── Ristorino-rest/        # Backend principal (Spring Boot) — lógica, seguridad, Gemini API
├── Restaurante1-rest/     # Proveedor externo #1 — servicio REST (simula un restaurante)
├── Restaurante2-soap/     # Proveedor externo #2 — servicio SOAP (simula un restaurante)
├── Restaurante3-rest/     # Proveedor externo #3 — servicio REST
├── Restaurante4-soap/     # Proveedor externo #4 — servicio SOAP
├── der/                   # Modelos de datos / DER: scripts .sql de cada restaurante y de Ristorino
└── Informes/              # Documentación e informes del proyecto
```

Ristorino (backend principal) actúa como orquestador: para cada restaurante externo, consulta su servicio REST o SOAP correspondiente y expone todo de forma unificada al frontend en Angular.

---

### 👥 Equipo

Proyecto grupal (3 integrantes) — **Esteban Ghinamo** y compañeros de equipo.

---

<div align="center"><sub>Córdoba, Argentina 🇦🇷</sub></div>

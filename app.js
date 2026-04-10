// ===== DATA MODEL =====
const defaultData = {
    estagio: {
        name: "Rafael Santos de Santana",
        objectiveTitle: "Estagiário em Desenvolvimento Front-End",
        objective: "Estudante TDS/Senac com projetos reais em React, Python e IA aplicada a áudio. Busco estágio em front-end com perfil hands-on e aprendizado constante.",
        phone: "(77) 99148-0877",
        email: "rafsplayofc@gmail.com",
        city: "São Carlos, SP",
        github: "github.com/rafaelsantana",
        linkedin: "",
        education: [{
            title: "Tecnólogo em Desenvolvimento de Sistemas (TDS)",
            institution: "Senac São Paulo — Em andamento (início 2026)",
            period: "2026 – presente",
            bullets: ["Foco em desenvolvimento web, banco de dados, engenharia de software e metodologias ágeis"]
        }],
        skills: [
            { label: "Front-End", value: "React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, design responsivo" },
            { label: "Back-End", value: "Python, Flask, API REST, Node.js (básico)" },
            { label: "Ferramentas", value: "Git, GitHub, VS Code, Figma, Vercel, Vite" },
            { label: "Outros", value: "Tone.js, Canvas API, Demucs (IA áudio), WhisperX" },
        ],
        projects: [
            {
                title: "Decifrai — Gerador de cifras musicais com IA",
                tech: "Python · Flask · React · Demucs · WhisperX",
                link: "github.com/rafaelsantana/decifrai",
                period: "2025 – presente",
                bullets: [
                    "Gera cifras a partir de áudio via IA: separação de stems + detecção de acordes sincronizada com a letra",
                    "Interface React com timeline interativa para edição e visualização das cifras"
                ]
            },
            {
                title: "Chord Wheel — App de ear training",
                tech: "HTML5 · Canvas API · Tone.js · JavaScript",
                link: "github.com/rafaelsantana/chord-wheel",
                period: "2025 – presente",
                bullets: [
                    "Roda de acordes interativa mobile-first com reprodução de áudio em tempo real (Tone.js)"
                ]
            },
            {
                title: "Bootcamps — Projetos práticos full stack",
                tech: "React · JavaScript · HTML/CSS",
                link: "",
                period: "2024 – 2025",
                bullets: ["Sistemas de barbearia, treinos e finanças — portfólio prático com foco em UX e componentização"]
            }
        ],
        experience: [
            {
                title: "Freelancer — Marketing Digital e Design",
                company: "Ninja do Delivery / Weverton Lima",
                period: "2025",
                bullets: ["Criação de conteúdo visual e estratégias de marketing digital para clientes locais"]
            },
            {
                title: "Atendente e Serviços Gerais",
                company: "Padaria D'Sula — São Carlos, SP",
                period: "Nov 2022 – Jan 2026",
                bullets: [
                    "Atendimento ao público, organização de estoque e operação de caixa por mais de 3 anos",
                    "Desenvolvimento de habilidades interpessoais, trabalho em equipe e gestão de tempo sob pressão"
                ]
            },
            {
                title: "Atendente",
                company: "Tuca's Bar — São Carlos, SP",
                period: "2022",
                bullets: ["Atendimento e serviços gerais em ambiente dinâmico de alta demanda"]
            }
        ],
        certifications: [
            "Designer de Qualidades — DDQ Ensinos (2022)",
            "Manutenção de Computadores — PROUNIP (2016)"
        ],
        languages: "Português — Nativo  |  Inglês — Básico (em desenvolvimento)"
    }
};

// Junior version: clone estagio but change objective
defaultData.junior = JSON.parse(JSON.stringify(defaultData.estagio));
defaultData.junior.objectiveTitle = "Desenvolvedor Front-End Júnior";
defaultData.junior.objective = "Dev front-end com projetos reais em React, Python e IA de áudio. Cursando TDS/Senac, com sólida base técnica e portfólio publicado.";

let currentVersion = 'estagio';

// ===== LOCALSTORAGE =====
const STORAGE_KEY = 'curriculo_data';

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn('Erro ao carregar dados salvos. Usando padrão.');
        }
    }
    return JSON.parse(JSON.stringify(defaultData));
}

let data = loadData();

// ===== SWITCH VERSION =====
function switchVersion(v) {
    currentVersion = v;
    document.querySelectorAll('.version-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.version-btn[onclick="switchVersion('${v}')"]`).classList.add('active');
    renderSidebar();
    renderPreview();
}

// ===== SIDEBAR RENDER =====
function renderSidebar() {
    const d = data[currentVersion];
    const sb = document.getElementById('sidebar');

    sb.innerHTML = `
    <div class="section-card">
      <h3>Dados Pessoais</h3>
      <div class="field"><label>Nome Completo</label><input value="${esc(d.name)}" oninput="upd('name', this.value)"></div>
      <div class="field"><label>Telefone</label><input value="${esc(d.phone)}" oninput="upd('phone', this.value)"></div>
      <div class="field"><label>Email</label><input value="${esc(d.email)}" oninput="upd('email', this.value)"></div>
      <div class="field"><label>Cidade</label><input value="${esc(d.city)}" oninput="upd('city', this.value)"></div>
      <div class="field"><label>GitHub</label><input value="${esc(d.github)}" oninput="upd('github', this.value)"></div>
      <div class="field"><label>LinkedIn (opcional)</label><input value="${esc(d.linkedin)}" oninput="upd('linkedin', this.value)" placeholder="linkedin.com/in/seu-perfil"></div>
    </div>

    <div class="section-card">
      <h3>Objetivo</h3>
      <div class="field"><label>Título do cargo</label><input value="${esc(d.objectiveTitle)}" oninput="upd('objectiveTitle', this.value)"></div>
      <div class="field"><label>Texto do objetivo</label><textarea rows="3" oninput="upd('objective', this.value)">${esc(d.objective)}</textarea></div>
    </div>

    <div class="section-card">
      <h3>Formação</h3>
      ${d.education.map((e, i) => entryBlock('education', i, e.title, [
                field('Curso/Título', e.title, `updArr('education',${i},'title',this.value)`),
                field('Instituição', e.institution, `updArr('education',${i},'institution',this.value)`),
                field('Período', e.period, `updArr('education',${i},'period',this.value)`),
                bulletsHTML('education', i, e.bullets)
            ])).join('')}
      <button class="add-btn" onclick="addEntry('education')">+ Adicionar formação</button>
    </div>

    <div class="section-card">
      <h3>Habilidades Técnicas</h3>
      ${d.skills.map((s, i) => `
        <div class="entry-block">
          <div class="entry-header">
            <span class="entry-title">${esc(s.label)}</span>
            <button class="remove-btn" onclick="removeEntry('skills',${i})">×</button>
          </div>
          ${field('Categoria', s.label, `updArr('skills',${i},'label',this.value)`)}
          ${field('Tecnologias', s.value, `updArr('skills',${i},'value',this.value)`)}
        </div>
      `).join('')}
      <button class="add-btn" onclick="addSkill()">+ Adicionar categoria</button>
    </div>

    <div class="section-card">
      <h3>Projetos Pessoais</h3>
      ${d.projects.map((p, i) => entryBlock('projects', i, p.title, [
                field('Nome do projeto', p.title, `updArr('projects',${i},'title',this.value)`),
                field('Link (GitHub)', p.link || '', `updArr('projects',${i},'link',this.value)`),
                field('Stack (use · como separador)', p.tech, `updArr('projects',${i},'tech',this.value)`),
                field('Período', p.period, `updArr('projects',${i},'period',this.value)`),
                bulletsHTML('projects', i, p.bullets)
            ])).join('')}
      <button class="add-btn" onclick="addProject()">+ Adicionar projeto</button>
    </div>

    <div class="section-card">
      <h3>Experiência Profissional</h3>
      ${d.experience.map((e, i) => entryBlock('experience', i, e.title, [
                field('Cargo', e.title, `updArr('experience',${i},'title',this.value)`),
                field('Empresa / Local', e.company, `updArr('experience',${i},'company',this.value)`),
                field('Período', e.period, `updArr('experience',${i},'period',this.value)`),
                bulletsHTML('experience', i, e.bullets)
            ])).join('')}
      <button class="add-btn" onclick="addExperience()">+ Adicionar experiência</button>
    </div>

    <div class="section-card">
      <h3>Certificações</h3>
      ${d.certifications.map((c, i) => `
        <div class="bullet-row">
          <input value="${esc(c)}" oninput="updCert(${i}, this.value)">
          <button class="bullet-remove" onclick="removeCert(${i})">×</button>
        </div>
      `).join('')}
      <button class="add-btn" onclick="addCert()">+ Adicionar certificação</button>
    </div>

    <div class="section-card">
      <h3>Idiomas</h3>
      <div class="field"><label>Idiomas</label><input value="${esc(d.languages)}" oninput="upd('languages', this.value)"></div>
    </div>
  `;
}

// ===== HELPERS =====
function esc(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function escH(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function field(label, value, handler) {
    return `<div class="field"><label>${label}</label><input value="${esc(value)}" oninput="${handler}"></div>`;
}

function entryBlock(section, index, title, fieldsArr) {
    return `<div class="entry-block">
    <div class="entry-header">
      <span class="entry-title">${escH(title).substring(0, 40)}${title.length > 40 ? '...' : ''}</span>
      <button class="remove-btn" onclick="removeEntry('${section}',${index})">×</button>
    </div>
    ${fieldsArr.join('')}
  </div>`;
}

function bulletsHTML(section, entryIdx, bullets) {
    return `<div class="bullets-area">
    <label style="display:block;font-size:11px;font-weight:500;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Tópicos</label>
    ${bullets.map((b, bi) => `
      <div class="bullet-row">
        <input value="${esc(b)}" oninput="updBullet('${section}',${entryIdx},${bi},this.value)">
        <button class="bullet-remove" onclick="removeBullet('${section}',${entryIdx},${bi})">×</button>
      </div>
    `).join('')}
    <button class="add-bullet-btn" onclick="addBullet('${section}',${entryIdx})">+ tópico</button>
  </div>`;
}

// ===== DATA UPDATES =====
function upd(key, val) { data[currentVersion][key] = val; saveData(); renderPreview(); }
function updArr(section, idx, key, val) { data[currentVersion][section][idx][key] = val; saveData(); renderPreview(); renderSidebar(); }
function updBullet(section, eIdx, bIdx, val) { data[currentVersion][section][eIdx].bullets[bIdx] = val; saveData(); renderPreview(); }
function removeBullet(section, eIdx, bIdx) { data[currentVersion][section][eIdx].bullets.splice(bIdx, 1); saveData(); renderSidebar(); renderPreview(); }
function addBullet(section, eIdx) { data[currentVersion][section][eIdx].bullets.push(""); saveData(); renderSidebar(); renderPreview(); }
function removeEntry(section, idx) { data[currentVersion][section].splice(idx, 1); saveData(); renderSidebar(); renderPreview(); }
function updCert(idx, val) { data[currentVersion].certifications[idx] = val; saveData(); renderPreview(); }
function removeCert(idx) { data[currentVersion].certifications.splice(idx, 1); saveData(); renderSidebar(); renderPreview(); }
function addCert() { data[currentVersion].certifications.push(""); saveData(); renderSidebar(); renderPreview(); }

function addEntry(section) {
    if (section === 'education') {
        data[currentVersion].education.push({ title: "", institution: "", period: "", bullets: [""] });
    }
    saveData(); renderSidebar(); renderPreview();
}
function addSkill() { data[currentVersion].skills.push({ label: "Nova", value: "" }); saveData(); renderSidebar(); renderPreview(); }
function addProject() {
    data[currentVersion].projects.push({ title: "Novo Projeto", tech: "", link: "", period: "", bullets: [""] });
    saveData(); renderSidebar(); renderPreview();
}
function addExperience() {
    data[currentVersion].experience.push({ title: "Novo Cargo", company: "", period: "", bullets: [""] });
    saveData(); renderSidebar(); renderPreview();
}

function resetData() {
    if (confirm('Resetar todos os dados para o padrão?')) {
        data = JSON.parse(JSON.stringify(defaultData));
        localStorage.removeItem(STORAGE_KEY);
        renderSidebar(); renderPreview();
    }
}

// ===== PREVIEW RENDER =====
function renderPreview() {
    const d = data[currentVersion];
    const contactParts = [d.city, d.phone, d.email, d.github, d.linkedin].filter(Boolean);

    document.getElementById('resume').innerHTML = `
    <div class="resume-header">
      <h2>${escH(d.name)}</h2>
      <div class="subtitle">${escH(d.objectiveTitle)}</div>
      <div class="contact">${escH(contactParts.join('  •  '))}</div>
    </div>
    <div class="resume-body">

      <div class="r-section">
        <div class="r-section-title">OBJETIVO</div>
        <div class="r-objective">${escH(d.objective)}</div>
      </div>

      <div class="r-section">
        <div class="r-section-title">FORMAÇÃO</div>
        ${d.education.map(e => `
          <div class="r-entry">
            <div class="r-entry-header">
              <span class="r-entry-title">${escH(e.title)}</span>
              <span class="r-entry-period">${escH(e.period)}</span>
            </div>
            <div class="r-entry-subtitle">${escH(e.institution)}</div>
            ${e.bullets.filter(b => b).map(b => `<div class="r-bullet">${escH(b)}</div>`).join('')}
          </div>
        `).join('')}
      </div>

      <div class="r-section">
        <div class="r-section-title">HABILIDADES TÉCNICAS</div>
        ${d.skills.map(s => `
          <div class="r-skills-row">
            <span class="r-skills-label">${escH(s.label)}:</span>
            <span class="r-skills-value"> ${escH(s.value)}</span>
          </div>
        `).join('')}
      </div>

      <div class="r-section">
        <div class="r-section-title">PROJETOS PESSOAIS</div>
        ${d.projects.map(p => `
          <div class="r-entry">
            <div class="r-entry-header">
              <span class="r-entry-title">${escH(p.title)}</span>
              <span class="r-entry-period">${escH(p.period)}</span>
            </div>
            ${p.link ? `<span class="r-entry-link">↗ ${escH(p.link)}</span>` : ''}
            <div class="r-entry-tech">${escH(p.tech)}</div>
            ${p.bullets.filter(b => b).slice(0, 2).map(b => `<div class="r-bullet">${escH(b)}</div>`).join('')}
          </div>
        `).join('')}
      </div>

      <div class="r-section">
        <div class="r-section-title">EXPERIÊNCIA PROFISSIONAL</div>
        ${d.experience.map(e => `
          <div class="r-entry">
            <div class="r-entry-header">
              <span class="r-entry-title">${escH(e.title)}</span>
              <span class="r-entry-period">${escH(e.period)}</span>
            </div>
            <div class="r-entry-subtitle">${escH(e.company)}</div>
            ${e.bullets.filter(b => b).map(b => `<div class="r-bullet">${escH(b)}</div>`).join('')}
          </div>
        `).join('')}
      </div>

      ${d.certifications.filter(c => c).length ? `
        <div class="r-section">
          <div class="r-section-title">CERTIFICAÇÕES E CURSOS</div>
          ${d.certifications.filter(c => c).map(c => `<div class="r-bullet">${escH(c)}</div>`).join('')}
        </div>
      ` : ''}

      <div class="r-section">
        <div class="r-section-title">IDIOMAS</div>
        <div style="font-size:8.5px;color:#333;">${escH(d.languages)}</div>
      </div>

    </div>
    <div class="resume-footer">
      ${escH([d.name, d.city, d.phone, d.email].filter(Boolean).join('  •  '))}
    </div>
  `;
}

// ===== PDF GENERATION =====
function generatePDF() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('show');

    const element = document.getElementById('resume');
    const d = data[currentVersion];
    const filename = currentVersion === 'estagio'
        ? 'curriculo_estagio_rafael.pdf'
        : 'curriculo_junior_rafael.pdf';

    const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        overlay.classList.remove('show');
    }).catch(() => {
        overlay.classList.remove('show');
        alert('Erro ao gerar PDF. Tente novamente.');
    });
}

// ===== INIT =====
renderSidebar();
renderPreview();

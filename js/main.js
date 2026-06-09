function renderCommands(containerId, filters = []) {
    const container = document.getElementById(containerId);
    if (!container || typeof COMMANDS_DATA === 'undefined') return;

    let html = '';

    // Helper to format syntax
    const formatSyntax = (str) => {
        return str
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(&lt;.*?&gt;)/g, '<span class="syntax-arg required">$1</span>')
            .replace(/(\[.*?\])/g, '<span class="syntax-arg optional">$1</span>');
    };

    COMMANDS_DATA.forEach(category => {
        const match = filters.length === 0 || filters.some(f => category.category.toLowerCase().includes(f.toLowerCase()));
        if (!match) return;

        html += `<div class="glass-panel mb-8">`;
        html += `<h2 class="category-title ${category.color}">${category.category}</h2>`;
        html += `<div class="commands-grid">`;

        category.items.forEach(cmd => {
            html += `<div class="command-card" onclick="navigator.clipboard.writeText('${cmd.example}')" title="Click to copy example!">
                <div class="cmd-title">${formatSyntax(cmd.cmd)}</div>
                ${cmd.aliases && cmd.aliases.length > 0 ? `<div class="cmd-aliases"><strong>Aliases:</strong> ${cmd.aliases.join(', ')}</div>` : ''}
                <div class="cmd-desc">${cmd.desc}</div>
                <div class="cmd-example">${cmd.example}</div>
            </div>`;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;

    // Add Return to Top Button
    const btn = document.createElement('button');
    btn.innerHTML = '⬆️<br>TOP';
    btn.className = 'scroll-top-btn';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

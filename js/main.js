function renderCommands(containerId, allowedCategories = []) {
    const container = document.getElementById(containerId);
    if (!container || typeof COMMANDS_DATA === 'undefined') return;

    // Filter data to only include the allowed categories for this page
    const pageData = COMMANDS_DATA.filter(category => {
        return allowedCategories.length === 0 || allowedCategories.some(f => category.category.toLowerCase().includes(f.toLowerCase()));
    });

    let activeCategory = 'ALL';
    let searchQuery = '';

    // Create UI Elements
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper mb-4';
    searchWrapper.innerHTML = `
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="TYPE TO FILTER (E.G. 'START', 'COIN', 'BROADCASTER')...">
    `;

    const pillsWrapper = document.createElement('div');
    pillsWrapper.className = 'pills-wrapper mb-8';

    const renderPills = () => {
        let pillsHtml = `<button class="category-pill ${activeCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">📁 ALL</button>`;
        pageData.forEach(cat => {
            const isActive = activeCategory === cat.category ? 'active' : '';
            // Strip emojis for the pill text if desired, or keep them. Let's keep them.
            pillsHtml += `<button class="category-pill ${isActive}" data-cat="${cat.category}">${cat.category}</button>`;
        });
        pillsWrapper.innerHTML = pillsHtml;

        // Attach events
        pillsWrapper.querySelectorAll('.category-pill').forEach(btn => {
            btn.onclick = (e) => {
                activeCategory = e.target.getAttribute('data-cat');
                renderPills();
                renderList();
            };
        });
    };

    const listContainer = document.createElement('div');
    listContainer.className = 'commands-list-container';

    // Helper to format syntax
    const formatSyntax = (str) => {
        return str
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(&lt;.*?&gt;)/g, '<span class="syntax-arg required">$1</span>')
            .replace(/(\[.*?\])/g, '<span class="syntax-arg optional">$1</span>');
    };

    const renderList = () => {
        let html = '';
        const lowerQuery = searchQuery.toLowerCase();

        pageData.forEach(category => {
            // Filter by active category pill
            if (activeCategory !== 'ALL' && category.category !== activeCategory) return;

            // Filter items by search query
            const filteredItems = category.items.filter(cmd => {
                if (!searchQuery) return true;
                const matchCmd = cmd.cmd.toLowerCase().includes(lowerQuery);
                const matchDesc = cmd.desc.toLowerCase().includes(lowerQuery);
                const matchAlias = cmd.aliases && cmd.aliases.some(a => a.toLowerCase().includes(lowerQuery));
                return matchCmd || matchDesc || matchAlias;
            });

            // If a search query is active and this category has no matches, don't render the category
            if (filteredItems.length === 0) return;

            html += `<div class="glass-panel mb-8">`;
            html += `<h2 class="category-title ${category.color}">${category.category}</h2>`;
            html += `<div class="commands-grid">`;

            filteredItems.forEach(cmd => {
                if (cmd.isSubHeader) {
                    html += `<div class="sub-category-title" style="grid-column: 1 / -1; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; width: 100%;">${cmd.title}</div>`;
                    return;
                }
                html += `<div class="command-card" onclick="navigator.clipboard.writeText('${cmd.example}')" title="Click to copy example!">
                    ${cmd.image ? `<div class="cmd-image" style="text-align: center; margin-bottom: 1rem;"><img src="${cmd.image}" alt="${cmd.cmd}" onerror="this.style.display='none'" style="max-width: 100%; max-height: 80px; border-radius: 8px;"/></div>` : ''}
                    <div class="cmd-title">${formatSyntax(cmd.cmd)}</div>
                    ${cmd.aliases && cmd.aliases.length > 0 ? `<div class="cmd-aliases"><strong>Aliases:</strong> ${cmd.aliases.join(', ')}</div>` : ''}
                    <div class="cmd-desc">${cmd.desc}</div>
                    <div class="cmd-example">${cmd.example}</div>
                </div>`;
            });

            html += `</div></div>`;
        });

        if (html === '') {
            html = `<div class="text-center" style="color: #64748b; padding: 2rem;">No commands found matching "${searchQuery}"</div>`;
        }

        listContainer.innerHTML = html;
    };

    // Build the container
    container.innerHTML = '';
    container.appendChild(searchWrapper);
    container.appendChild(pillsWrapper);
    container.appendChild(listContainer);

    // Attach search event
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderList();
    });

    renderPills();
    renderList();

    // Add Return to Top Button (only once)
    if (!document.querySelector('.scroll-top-btn')) {
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
}
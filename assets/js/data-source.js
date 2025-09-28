/**
 * BSix.com Data Source
 * Provides latest data for the entire website to ensure consistency.
 */

const BSIX_DATA = {
    // Latest Premier League Table (2025-26 Season)
    premierLeagueTable: [
        {
            rank: 1,
            team: "Liverpool",
            logo: "L",
            played: 6,
            wins: 5,
            draws: 1,
            losses: 0,
            gd: 5,
            points: 15,
            form: ["W", "W", "W", "D", "W"]
        },
        {
            rank: 2,
            team: "Crystal Palace",
            logo: "CP",
            played: 6,
            wins: 3,
            draws: 3,
            losses: 0,
            gd: 5,
            points: 12,
            form: ["D", "D", "W", "W", "D"]
        },
        {
            rank: 3,
            team: "Tottenham Hotspur",
            logo: "T",
            played: 6,
            wins: 3,
            draws: 2,
            losses: 1,
            gd: 7,
            points: 11,
            form: ["W", "L", "D", "W", "W"]
        },
        {
            rank: 4,
            team: "Sunderland",
            logo: "S",
            played: 6,
            wins: 3,
            draws: 2,
            losses: 1,
            gd: 3,
            points: 11,
            form: ["W", "D", "W", "L", "W"]
        },
        {
            rank: 5,
            team: "Arsenal",
            logo: "A",
            played: 5,
            wins: 3,
            draws: 1,
            losses: 1,
            gd: 8,
            points: 10,
            form: ["W", "W", "D", "L", "W"]
        },
        {
            rank: 6,
            team: "Manchester City",
            logo: "MC",
            played: 5,
            wins: 3,
            draws: 1,
            losses: 1,
            gd: 7,
            points: 10,
            form: ["W", "D", "W", "L", "W"]
        },
        {
            rank: 7,
            team: "Chelsea",
            logo: "C",
            played: 5,
            wins: 2,
            draws: 2,
            losses: 1,
            gd: 4,
            points: 8,
            form: ["D", "W", "D", "L", "W"]
        },
        {
            rank: 8,
            team: "Manchester United",
            logo: "MU",
            played: 5,
            wins: 2,
            draws: 1,
            losses: 2,
            gd: 2,
            points: 7,
            form: ["W", "L", "D", "W", "L"]
        }
    ],

    // Top Scorers
    topScorers: [
        { rank: 1, name: "Erling Haaland", team: "Manchester City", goals: 8 },
        { rank: 2, name: "Mohamed Salah", team: "Liverpool", goals: 6 },
        { rank: 3, name: "Gabriel Jesus", team: "Arsenal", goals: 5 },
        { rank: 4, name: "Son Heung-min", team: "Tottenham Hotspur", goals: 5 },
    ],

    /**
     * Generates the HTML for the Premier League table.
     * @returns {string} HTML string for the table.
     */
    generatePremierLeagueTableHTML: function() {
        let tableHTML = `
            <div class="table-container">
                <h2 class="section-title">🏆 プレミアリーグ順位表</h2>
                <p class="section-subtitle">2025-26シーズン | 最新データ</p>
                <div class="table-wrapper">
                    <table class="premier-league-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>チーム</th>
                                <th>試合</th>
                                <th>勝</th>
                                <th>分</th>
                                <th>敗</th>
                                <th>得失</th>
                                <th>点</th>
                                <th>直近5試合</th>
                            </tr>
                        </thead>
                        <tbody>`;

        this.premierLeagueTable.forEach(row => {
            tableHTML += `
                <tr>
                    <td>${row.rank}</td>
                    <td class="team-cell">
                        <span class="team-logo team-logo-${row.team.toLowerCase().replace(/\s+/g, "-")}">${row.logo}</span>
                        <span class="team-name">${row.team}</span>
                    </td>
                    <td>${row.played}</td>
                    <td>${row.wins}</td>
                    <td>${row.draws}</td>
                    <td>${row.losses}</td>
                    <td>${row.gd > 0 ? "+" : ""}${row.gd}</td>
                    <td class="points">${row.points}</td>
                    <td class="form-guide">
                        ${row.form.map(f => `<span class="form-indicator form-${f.toLowerCase()}">${f}</span>`).join("")}
                    </td>
                </tr>`;
        });

        tableHTML += `
                        </tbody>
                    </table>
                </div>
            </div>`;

        return tableHTML;
    },

    /**
     * Injects the Premier League table into a target element.
     * @param {string} targetId - The ID of the element to inject the table into.
     */
    injectPremierLeagueTable: function(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = this.generatePremierLeagueTableHTML();
        } else {
            console.error(`Target element with ID "${targetId}" not found.`);
        }
    }
};

// Add styles for the table
document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
        .table-container {
            padding: 20px;
            background: var(--neutral-100, #f5f5f5);
            border-radius: var(--radius-xl, 1rem);
            box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
            margin-bottom: var(--space-2xl, 3rem);
        }
        .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--neutral-800, #262626);
        }
        .section-subtitle {
            font-size: 1rem;
            color: var(--neutral-500, #737373);
            margin-bottom: 24px;
        }
        .table-wrapper {
            overflow-x: auto;
        }
        .premier-league-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }
        .premier-league-table th, .premier-league-table td {
            padding: 12px 15px;
            text-align: center;
            border-bottom: 1px solid var(--neutral-200, #e5e5e5);
        }
        .premier-league-table th {
            font-weight: 600;
            color: var(--neutral-600, #525252);
            background: var(--neutral-200, #e5e5e5);
        }
        .premier-league-table .team-cell {
            text-align: left;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .team-logo {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 0.8rem;
        }
        .team-logo-liverpool { background-color: #c8102e; }
        .team-logo-crystal-palace { background-color: #1b458f; }
        .team-logo-tottenham-hotspur { background-color: #132257; }
        .team-logo-sunderland { background-color: #eb172b; }
        .team-logo-arsenal { background-color: #ef0107; }
        .team-logo-manchester-city { background-color: #6cabdd; }
        .team-logo-chelsea { background-color: #034694; }
        .team-logo-manchester-united { background-color: #da291c; }
        .premier-league-table .points {
            font-weight: bold;
            color: var(--neutral-800, #262626);
        }
        .form-guide {
            display: flex;
            gap: 4px;
            justify-content: center;
        }
        .form-indicator {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            color: white;
        }
        .form-w { background-color: #28a745; }
        .form-d { background-color: #ffc107; color: #333; }
        .form-l { background-color: #dc3545; }

        /* Dark mode adjustments */
        .nothing-theme .table-container { background: var(--neutral-800, #262626); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); }
        .nothing-theme .section-title { color: var(--neutral-100, #f5f5f5); }
        .nothing-theme .section-subtitle { color: var(--neutral-400, #a3a3a3); }
        .nothing-theme .premier-league-table th, .nothing-theme .premier-league-table td { border-bottom-color: var(--neutral-700, #404040); }
        .nothing-theme .premier-league-table th { background: var(--neutral-700, #404040); color: var(--neutral-300, #d4d4d4); }
        .nothing-theme .premier-league-table .points { color: var(--neutral-100, #f5f5f5); }
    `;
    document.head.appendChild(style);
});


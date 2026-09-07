// =========================================
// SmartStudy - Frontend API Connection
// =========================================

const API_URL = "http://127.0.0.1:5000/recommend";


// =========================================
// Get Recommendations
// =========================================

async function getRecommendations() {

    const subject =
        document.getElementById("subject").value;

    const topic =
        document.getElementById("topic").value.trim();

    const level =
        document.getElementById("level").value;

    const resourceType =
        document.getElementById("resourceType").value;

    const resultsContainer =
        document.getElementById("results");


    // Validate required fields
    if (!subject || !topic || !level) {

        resultsContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">⚠️</div>

                <h3>
                    Please complete the required fields
                </h3>

                <p>
                    Select a subject, enter a topic and choose
                    your difficulty level.
                </p>

            </div>
        `;

        return;
    }


    // Show loading message
    resultsContainer.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">✨</div>

            <h3>
                Finding the best resources...
            </h3>

            <p>
                SmartStudy is analyzing your requirements.
            </p>

        </div>
    `;


    try {

        // Send request to Flask backend
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                subject: subject,

                topic: topic,

                level: level,

                resourceType: resourceType

            })

        });


        const data = await response.json();


        // Handle backend error
        if (!response.ok) {

            throw new Error(
                data.message || "Something went wrong."
            );

        }


        // Display recommendations
        displayRecommendations(
            data.recommendations
        );


    } catch (error) {

        console.error(error);

        resultsContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">❌</div>

                <h3>
                    Unable to connect to SmartStudy
                </h3>

                <p>
                    Please make sure the Flask backend
                    is running on port 5000.
                </p>

            </div>
        `;

    }

}


// =========================================
// Display Recommendations
// =========================================

function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById("results");

    if (!recommendations || recommendations.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No matching resources found</h3>
                <p>Try another topic, difficulty level or resource type.</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = recommendations.map((resource, index) => {

        const resourceType = resource.type
            ? resource.type.charAt(0).toUpperCase() + resource.type.slice(1)
            : "Resource";

        const level = resource.level
            ? resource.level.charAt(0).toUpperCase() + resource.level.slice(1)
            : "General";

        return `
            <div class="resource-card">

                <div class="resource-top">
                    <div class="resource-icon">
                        ${resource.icon || "📚"}
                    </div>

                    <div class="rank-badge">
                        #${index + 1}
                    </div>
                </div>

                <h3>${resource.title}</h3>

                <p class="resource-description">
                    ${resource.description}
                </p>

                <div class="resource-tags">
                    <span class="resource-tag">
                        📚 ${resourceType}
                    </span>

                    <span class="resource-tag">
                        🎯 ${level}
                    </span>
                </div>

                <div class="resource-bottom">

                    <div class="match-score">
                        <span class="match-label">Match</span>
                        <strong>${resource.match}%</strong>
                    </div>

                    <a
                        href="${resource.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="resource-link"
                    >
                        View Resource →
                    </a>

                </div>

            </div>
        `;
    }).join("");
}

    // Create resource cards
    resultsContainer.innerHTML =
        recommendations.map(resource => {

            return `
                <div class="resource-card">

                    <div class="resource-icon">
                        ${resource.icon}
                    </div>

                    <h3>
                        ${resource.title}
                    </h3>

                    <p>
                        ${resource.description}
                    </p>

                    <div class="resource-meta">

                        <span class="match">
                            ${resource.match}% Match
                        </span>

                        <a
                            href="${resource.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="resource-link"
                        >
                            View Resource →
                        </a>

                    </div>

                </div>
            `;

        }).join("");


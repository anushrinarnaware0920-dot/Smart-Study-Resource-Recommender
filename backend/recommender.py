def recommend_resources(resources, subject, topic, level, resource_type=None):

    subject = subject.lower().strip()
    topic = topic.lower().strip()

    type_mapping = {
        "videos": "video",
        "video": "video",
        "notes": "notes",
        "practice": "practice",
        "any": None,
        "": None
    }

    selected_type = type_mapping.get(
        resource_type.lower().strip() if resource_type else "",
        resource_type.lower().strip() if resource_type else None
    )

    recommendations = []

    for resource in resources:

        resource_subject = resource["subject"].lower()
        resource_topic = resource["topic"].lower()
        resource_level = resource["level"].lower()
        resource_type_value = resource["type"].lower()

        # Subject must match
        if resource_subject != subject:
            continue

        # Resource type filter
        if selected_type and resource_type_value != selected_type:
            continue

        score = 0

        # Level matching
        if resource_level == level.lower():
            score += 30
        else:
            continue

        # Topic matching
        title = resource["title"].lower()
        description = resource["description"].lower()

        if topic == resource_topic:
            score += 40
        elif topic in resource_topic or resource_topic in topic:
            score += 30
        elif topic in title:
            score += 20
        elif topic in description:
            score += 10

        # Add original resource match score
        score += resource.get("match", 0) * 0.3

        # Store calculated score
        resource_copy = resource.copy()
        resource_copy["match"] = min(round(score), 99)

        # Only include resources with some topic relevance
        if score >= 30:
            recommendations.append(resource_copy)

    # If no topic-specific resources are found,
    # provide general resources for the selected subject and level.
    if not recommendations:

        for resource in resources:

            if (
                resource["subject"].lower() == subject
                and resource["level"].lower() == level.lower()
            ):

                if selected_type:
                    if resource["type"].lower() != selected_type:
                        continue

                resource_copy = resource.copy()
                resource_copy["match"] = resource.get("match", 70)

                recommendations.append(resource_copy)

    # Highest match first
    recommendations.sort(
        key=lambda resource: resource["match"],
        reverse=True
    )

    return recommendations[:6]
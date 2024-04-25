export default function setVariantPriorityInfo(priority) {
    const priorityLowerCase = priority?.toLowerCase();
    let variant;
    if (priorityLowerCase == "alta") variant = "danger";
    else if (priorityLowerCase == "media") variant = "warning";
    else if (priorityLowerCase == "baja") variant = "info";
    else variant = "secondary";
    return variant;
}

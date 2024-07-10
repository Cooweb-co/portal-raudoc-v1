export default function setVariantPriorityInfo(priority) {
    const priorityLowerCase = priority?.toLowerCase();
    const variants = {
        "alta": "danger",
        "media": "warning",
        "baja": "info"
    }
    return variants[priorityLowerCase] ?? "secondary";
}

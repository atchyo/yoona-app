import type { DrugIngredient, DrugSource, Medication, MedicationSchedule } from "../types";

export function formatIngredient(ingredient: DrugIngredient): string {
  return ingredient.amount ? `${ingredient.name} ${ingredient.amount}` : ingredient.name;
}

export function ingredientSummary(ingredients: DrugIngredient[]): string {
  return ingredients.map(formatIngredient).join(", ") || "성분 미등록";
}

export function sourceLabel(source: DrugSource): string {
  if (source === "mfds_permit") return "식약처 허가정보";
  if (source === "mfds_easy") return "e약은요";
  if (source === "mfds_health") return "건강기능식품정보";
  if (source === "rxnorm") return "RxNorm";
  if (source === "dailymed") return "DailyMed";
  if (source === "openfda") return "openFDA";
  return "수기 입력";
}

export function medicationStatusLabel(medication: Medication): string {
  if (medication.status === "confirmed") return "확정 등록";
  if (medication.status === "needs_review") return "검토 필요";
  return "임시 등록";
}

export function medicationPeriodText(medication: Medication): string {
  const start = medication.startedAt ? formatDate(medication.startedAt) : "시작일 미등록";
  if (!medication.reviewAt) return `${start} 시작`;

  return `${start} 시작 · ${formatDate(medication.reviewAt)} 검토 예정`;
}

export function medicationScheduleText(
  medication: Medication,
  schedules: MedicationSchedule[],
): string {
  const medicationSchedules = schedules.filter((schedule) => schedule.medicationId === medication.id);
  if (medicationSchedules.length) {
    return medicationSchedules
      .map((schedule) => `${schedule.timeOfDay} ${schedule.label}`)
      .join(", ");
  }

  return medication.instructions || medication.dosage || "복용 주기 미등록";
}

export function medicationGuidanceText(medication: Medication): string {
  const details = [
    medication.instructions && `복용법: ${medication.instructions}`,
    medication.dosage && `용량: ${medication.dosage}`,
    medication.warnings.length ? `주의: ${medication.warnings.join(" / ")}` : "",
    medication.interactions.length ? `상호작용: ${medication.interactions.join(" / ")}` : "",
  ].filter(Boolean);

  return details.join(" · ") || "등록된 복약 지도 메모가 없습니다.";
}

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

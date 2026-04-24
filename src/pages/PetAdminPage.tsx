import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { CareProfile, FamilyWorkspace, Medication } from "../types";

interface PetAdminPageProps {
  careProfiles: CareProfile[];
  medications: Medication[];
  onAddCareProfile: (profile: CareProfile) => Promise<void> | void;
  onDeleteCareProfile: (profileId: string) => Promise<void> | void;
  onUpdateCareProfile: (profileId: string, patch: Partial<CareProfile>) => Promise<void> | void;
  workspace: FamilyWorkspace;
}

interface PetFormState {
  name: string;
  birthDate: string;
  age: string;
  weightKg: string;
  allergies: string;
  mainFood: string;
  forbiddenFoods: string;
}

const emptyPetForm: PetFormState = {
  name: "",
  birthDate: "",
  age: "",
  weightKg: "",
  allergies: "",
  mainFood: "",
  forbiddenFoods: "",
};

export function PetAdminPage({
  careProfiles,
  medications,
  onAddCareProfile,
  onDeleteCareProfile,
  onUpdateCareProfile,
  workspace,
}: PetAdminPageProps): ReactElement {
  const pets = useMemo(() => careProfiles.filter((profile) => profile.type === "pet"), [careProfiles]);
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || "");
  const [form, setForm] = useState<PetFormState>(emptyPetForm);
  const [statusMessage, setStatusMessage] = useState("");
  const selectedPet = pets.find((profile) => profile.id === selectedPetId) || pets[0];

  useEffect(() => {
    if (!selectedPetId && pets[0]) {
      setSelectedPetId(pets[0].id);
    }
    if (selectedPetId && !pets.some((pet) => pet.id === selectedPetId)) {
      setSelectedPetId(pets[0]?.id || "");
    }
  }, [pets, selectedPetId]);

  const selectedPetMedications = selectedPet
    ? medications.filter((medication) => medication.careProfileId === selectedPet.id)
    : [];

  function updateForm(field: keyof PetFormState, value: string): void {
    setStatusMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function addPet(): Promise<void> {
    const name = form.name.trim();
    if (!name) {
      setStatusMessage("반려동물 이름을 입력해 주세요.");
      return;
    }
    if (pets.some((pet) => pet.name.trim().toLocaleLowerCase("ko-KR") === name.toLocaleLowerCase("ko-KR"))) {
      setStatusMessage("이미 등록된 이름입니다. 구분할 수 있게 이름을 바꿔 주세요.");
      return;
    }

    try {
      await onAddCareProfile({
        id: `profile-pet-${crypto.randomUUID()}`,
        workspaceId: workspace.id,
        name,
        type: "pet",
        ageGroup: "20",
        notes: buildPetNotes(form) || "반려동물 영양제와 약은 수의사 확인이 필요합니다.",
        petDetails: {
          birthDate: form.birthDate || undefined,
          age: form.age || undefined,
          weightKg: form.weightKg || undefined,
          allergies: form.allergies || undefined,
          mainFood: form.mainFood || undefined,
          forbiddenFoods: form.forbiddenFoods || undefined,
        },
      });
      setForm(emptyPetForm);
      setStatusMessage(`${name} 등록 완료`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "반려동물 등록 중 문제가 발생했습니다.");
    }
  }

  async function updateSelectedPet(field: keyof NonNullable<CareProfile["petDetails"]>, value: string): Promise<void> {
    if (!selectedPet) return;
    setStatusMessage("");
    await onUpdateCareProfile(selectedPet.id, {
      petDetails: {
        ...selectedPet.petDetails,
        [field]: value || undefined,
      },
    });
  }

  async function updateSelectedName(value: string): Promise<void> {
    if (!selectedPet) return;
    const name = value.trim();
    if (!name) {
      setStatusMessage("반려동물 이름을 입력해 주세요.");
      return;
    }
    if (
      pets.some(
        (pet) =>
          pet.id !== selectedPet.id &&
          pet.name.trim().toLocaleLowerCase("ko-KR") === name.toLocaleLowerCase("ko-KR"),
      )
    ) {
      setStatusMessage("이미 등록된 이름입니다. 구분할 수 있게 이름을 바꿔 주세요.");
      return;
    }
    await onUpdateCareProfile(selectedPet.id, { name });
    setStatusMessage(`${name} 저장 완료`);
  }

  async function deleteSelectedPet(): Promise<void> {
    if (!selectedPet) return;
    const confirmed = window.confirm(`${selectedPet.name} 프로필을 삭제할까요? 등록된 약 기록도 함께 정리됩니다.`);
    if (!confirmed) return;
    try {
      await onDeleteCareProfile(selectedPet.id);
      setStatusMessage(`${selectedPet.name} 삭제 완료`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "반려동물 삭제 중 문제가 발생했습니다.");
    }
  }

  return (
    <div className="pet-admin-page">
      <aside className="card pet-list-panel">
        <div className="section-heading">
          <p className="eyebrow">Pet Profiles</p>
          <h2>반려동물 목록</h2>
        </div>
        <div className="pet-profile-list">
          {pets.map((pet) => (
            <button
              className={pet.id === selectedPet?.id ? "pet-profile-button active" : "pet-profile-button"}
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              type="button"
            >
              <strong>{pet.name}</strong>
              <span>{petSummaryLine(pet)}</span>
            </button>
          ))}
          {!pets.length && <p className="empty-panel">등록된 반려동물이 없습니다.</p>}
        </div>
      </aside>

      <section className="card pet-detail-panel">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Pet Care</p>
            <h2>{selectedPet ? `${selectedPet.name} 정보` : "반려동물 정보"}</h2>
            <p className="muted">사료, 알러지, 금지 음식, 복용 중인 영양제를 함께 관리합니다.</p>
          </div>
          {selectedPet && (
            <button className="danger-button" onClick={deleteSelectedPet} type="button">
              삭제
            </button>
          )}
        </div>
        {statusMessage && <p className="form-note">{statusMessage}</p>}
        {selectedPet ? (
          <div className="pet-detail-grid">
            <label>
              이름
              <input
                defaultValue={selectedPet.name}
                onBlur={(event) => void updateSelectedName(event.currentTarget.value)}
              />
            </label>
            <label>
              생년월일
              <input
                type="date"
                defaultValue={selectedPet.petDetails?.birthDate || ""}
                key={`${selectedPet.id}-birthDate`}
                onBlur={(event) => void updateSelectedPet("birthDate", event.currentTarget.value)}
              />
            </label>
            <label>
              나이
              <input
                defaultValue={selectedPet.petDetails?.age || ""}
                key={`${selectedPet.id}-age`}
                onBlur={(event) => void updateSelectedPet("age", event.currentTarget.value)}
              />
            </label>
            <label>
              몸무게 kg
              <input
                inputMode="decimal"
                defaultValue={selectedPet.petDetails?.weightKg || ""}
                key={`${selectedPet.id}-weightKg`}
                onBlur={(event) => void updateSelectedPet("weightKg", event.currentTarget.value)}
              />
            </label>
            <label>
              알러지
              <input
                defaultValue={selectedPet.petDetails?.allergies || ""}
                key={`${selectedPet.id}-allergies`}
                onBlur={(event) => void updateSelectedPet("allergies", event.currentTarget.value)}
              />
            </label>
            <label>
              주로 먹는 사료
              <input
                defaultValue={selectedPet.petDetails?.mainFood || ""}
                key={`${selectedPet.id}-mainFood`}
                onBlur={(event) => void updateSelectedPet("mainFood", event.currentTarget.value)}
              />
            </label>
            <label className="pet-detail-wide">
              금지 음식
              <input
                defaultValue={selectedPet.petDetails?.forbiddenFoods || ""}
                key={`${selectedPet.id}-forbiddenFoods`}
                onBlur={(event) => void updateSelectedPet("forbiddenFoods", event.currentTarget.value)}
              />
            </label>
          </div>
        ) : (
          <p className="empty-panel">왼쪽에서 반려동물을 선택하거나 새로 등록해 주세요.</p>
        )}

        <div className="pet-medication-panel">
          <h3>복용/섭취 중인 약·영양제</h3>
          {selectedPetMedications.map((medication) => (
            <article className="pet-medication-row" key={medication.id}>
              <strong>{medication.productName}</strong>
              <span>{medication.instructions || medication.dosage || "복용 정보 미등록"}</span>
            </article>
          ))}
          {!selectedPetMedications.length && <p className="muted">등록된 약이나 영양제가 없습니다.</p>}
        </div>
      </section>

      <section className="card pet-add-panel">
        <div className="section-heading">
          <p className="eyebrow">Add Pet</p>
          <h2>반려동물 등록</h2>
        </div>
        <div className="pet-detail-grid">
          <label>
            이름
            <input value={form.name} onChange={(event) => updateForm("name", event.currentTarget.value)} />
          </label>
          <label>
            생년월일
            <input type="date" value={form.birthDate} onChange={(event) => updateForm("birthDate", event.currentTarget.value)} />
          </label>
          <label>
            나이
            <input value={form.age} onChange={(event) => updateForm("age", event.currentTarget.value)} />
          </label>
          <label>
            몸무게 kg
            <input inputMode="decimal" value={form.weightKg} onChange={(event) => updateForm("weightKg", event.currentTarget.value)} />
          </label>
          <label>
            알러지
            <input value={form.allergies} onChange={(event) => updateForm("allergies", event.currentTarget.value)} />
          </label>
          <label>
            주로 먹는 사료
            <input value={form.mainFood} onChange={(event) => updateForm("mainFood", event.currentTarget.value)} />
          </label>
          <label className="pet-detail-wide">
            금지 음식
            <input value={form.forbiddenFoods} onChange={(event) => updateForm("forbiddenFoods", event.currentTarget.value)} />
          </label>
        </div>
        <button className="primary-button wide" onClick={addPet} type="button">
          반려동물 등록
        </button>
      </section>
    </div>
  );
}

function petSummaryLine(profile: CareProfile): string {
  const details = profile.petDetails || {};
  return [
    details.age,
    details.weightKg && `${details.weightKg}kg`,
    details.allergies && `알러지 ${details.allergies}`,
  ]
    .filter(Boolean)
    .join(" · ") || profile.notes || "상세 정보 없음";
}

function buildPetNotes(form: PetFormState): string {
  return [
    form.age && `나이 ${form.age}`,
    form.weightKg && `몸무게 ${form.weightKg}kg`,
    form.allergies && `알러지 ${form.allergies}`,
    form.mainFood && `주요 사료 ${form.mainFood}`,
    form.forbiddenFoods && `금지 음식 ${form.forbiddenFoods}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

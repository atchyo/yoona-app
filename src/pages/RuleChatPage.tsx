import { useState } from "react";
import type { ReactElement } from "react";
import { answerRuleBasedQuestion } from "../services/ruleChat";
import type { CareProfile, Medication, RuleChatResponse } from "../types";

interface RuleChatPageProps {
  currentProfile: CareProfile;
  medications: Medication[];
}

const exampleQuestions = [
  "감기약 먹어도 괜찮을까요?",
  "오메가3와 혈압약을 같이 먹어도 되나요?",
  "마그네슘을 오래 먹어도 되나요?",
  "운전 전에 감기약을 먹어도 되나요?",
];

export function RuleChatPage({
  currentProfile,
  medications,
}: RuleChatPageProps): ReactElement {
  const [question, setQuestion] = useState(exampleQuestions[0]);
  const [response, setResponse] = useState<RuleChatResponse>();
  const profileMeds = medications.filter((medication) => medication.careProfileId === currentProfile.id);

  function handleAsk(nextQuestion = question): void {
    const cleanQuestion = nextQuestion.trim();
    if (!cleanQuestion) return;
    setQuestion(cleanQuestion);
    setResponse(answerRuleBasedQuestion(cleanQuestion, profileMeds, currentProfile));
  }

  return (
    <div className="chat-page">
      <aside className="card chat-history-panel">
        <p className="eyebrow">Recent Topics</p>
        <h2>상담 주제</h2>
        <div className="question-list">
          {exampleQuestions.map((item) => (
            <button
              className={item === question ? "question-item active" : "question-item"}
              key={item}
              onClick={() => handleAsk(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      <section className="card chat-room-panel">
        <div className="section-heading">
          <p className="eyebrow">Rule-based Assistant</p>
          <h2>{currentProfile.name}님 기준 상담 안내</h2>
          <p className="muted">등록된 약과 성분 중복, DB 주의사항을 기준으로 확인할 점을 정리합니다.</p>
        </div>

        <div className="chat-message-list">
          <div className="chat-bubble user">{question}</div>
          {response ? (
            <div className="chat-bubble assistant">
              <p>{response.answer}</p>
              <small>{response.disclaimer}</small>
            </div>
          ) : (
            <div className="chat-bubble assistant">
              등록 약 기준으로 먼저 확인해 드릴게요. 위험하거나 애매한 내용은 약사 또는 의사 상담을 권합니다.
            </div>
          )}
        </div>

        <div className="chat-input-row">
          <input
            aria-label="상담 질문"
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleAsk();
            }}
            placeholder="궁금한 내용을 입력하세요"
            value={question}
          />
          <button className="primary-button" onClick={() => handleAsk()} type="button">
            보내기
          </button>
        </div>
      </section>

      <aside className="chat-context-panel">
        <section className="card compact-card">
          <p className="eyebrow">Medication Context</p>
          <h2>상담에 반영되는 약</h2>
          <ul className="timeline-list">
            {profileMeds.map((medication) => (
              <li key={medication.id}>{medication.productName}</li>
            ))}
          </ul>
          {!profileMeds.length && <p className="muted">등록된 약이 없으면 일반적인 주의 안내만 가능합니다.</p>}
        </section>
        {response && (
          <section className="card compact-card">
            <p className="eyebrow">Findings</p>
            <h2>주의 항목</h2>
            <ul className="finding-list">
              {response.findings.map((finding) => (
                <li className={finding.level === "고위험" ? "danger-box" : "warning-box"} key={finding.id}>
                  <strong>{finding.title}</strong>
                  <span>{finding.message}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}

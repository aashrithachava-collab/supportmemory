import { useState } from "react";
import "./App.css";

function App() {
  const [issue, setIssue] = useState("");
  const [response, setResponse] = useState("");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);

  const loadSupport = async () => {
    if (!issue.trim()) return;

    setLoading(true);
    setResolved(false);

    try {
      const memoryRes = await fetch(
        "http://127.0.0.1:8001/customer/Rahul/memory"
      );
      const memoryData = await memoryRes.json();
      setMemories(memoryData.memories || []);

      const supportRes = await fetch(
        `http://127.0.0.1:8001/customer/Rahul/support?issue=${encodeURIComponent(issue)}`
      );
      const supportData = await supportRes.json();
      setResponse(supportData.response || "No response generated.");
    } catch (error) {
      setResponse(
        "Unable to connect to the SupportMemory backend. Make sure the backend is running on port 8001."
      );
    }

    setLoading(false);
  };

  const markResolved = async () => {
    try {
      await fetch(
        `http://127.0.0.1:8001/customer/Rahul/resolve?issue=${encodeURIComponent(
          issue
        )}&solution=${encodeURIComponent(
          "Updated Wi-Fi network driver"
        )}&outcome=Resolved`
      );

      setResolved(true);
    } catch (error) {
      setResolved(false);
    }
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>SupportMemory AI</h1>
          <p>Support that remembers.</p>
        </div>
        <span className="status">● Memory Online</span>
      </header>

      <main>
        <section className="customer-card">
          <div>
            <span className="label">CUSTOMER</span>
            <h2>Rahul</h2>
            <p>Windows Laptop User</p>
          </div>
          <div className="customer-avatar">R</div>
        </section>

        <section className="grid">
          <div className="panel">
            <h3>🧠 Customer Memory</h3>
            <p className="muted">
              Hindsight memories retrieved for Rahul
            </p>

            <div className="memory-list">
              {memories.length > 0 ? (
                memories.map((memory, index) => (
                  <div className="memory" key={index}>
                    {memory}
                  </div>
                ))
              ) : (
                <div className="memory">
                  Ask the agent about Rahul to retrieve his history.
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <h3>💬 New Support Issue</h3>

            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the customer's issue..."
            />

            <button onClick={loadSupport} disabled={loading}>
              {loading ? "Thinking..." : "Get Personalized Support"}
            </button>

            {response && (
              <div className="response">
                <h3>✨ Personalized Response</h3>
                <div className="response-text">{response}</div>
              </div>
            )}

            {response && (
              <button className="resolve" onClick={markResolved}>
                ✓ Mark Issue Resolved
              </button>
            )}

            {resolved && (
              <div className="success">
                ✓ Memory updated successfully
                <br />
                Hindsight now remembers this resolution.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
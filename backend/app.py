import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from hindsight_client import Hindsight

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="SupportMemory AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hindsight = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY"),
)


@app.get("/")
def home():
    return {
        "message": "SupportMemory AI backend is running!"
    }
@app.get("/customer/{customer_name}/memory")
def get_customer_memory(customer_name: str):
    result = hindsight.recall(
        bank_id="supportmemory-ai",
        query=f"What do we know about customer {customer_name}, their previous issues, successful and failed solutions, and preferences?"
    )

    return {
        "customer": customer_name,
        "memories": [memory.text for memory in result.results]
   }
@app.get("/customer/{customer_name}/support")
def personalized_support(customer_name: str, issue: str):
    response = hindsight.reflect(
        bank_id="supportmemory-ai",
        query=(
            f"You are a customer support agent helping customer {customer_name}. "
            f"The customer's current support issue is exactly: '{issue}'. "
            f"Use only memories that are relevant to this customer's support history. "
            f"Focus on the customer's device, previous support issues, failed solutions, "
            f"successful solutions, and preferences. "
            f"Do not discuss software development, servers, APIs, Uvicorn, ports, "
            f"programming, or this application's implementation. "
            f"Give a concise, personalized, step-by-step customer support response. "
            f"If a previous solution successfully solved the same issue, mention it."
        )
    )

    return {
        "customer": customer_name,
        "issue": issue,
        "response": response.text
    }
@app.get("/customer/{customer_name}/resolve")
def save_resolution(customer_name: str, issue: str, solution: str, outcome: str):
    memory = (
        f"Customer {customer_name} had the issue: {issue}. "
        f"Support solution: {solution}. "
        f"Outcome: {outcome}. "
        f"This resolution should be remembered for future support."
    )

    hindsight.retain(
        bank_id="supportmemory-ai",
        content=memory
    )

    return {
        "customer": customer_name,
        "status": "resolution_saved",
        "memory": memory
    }

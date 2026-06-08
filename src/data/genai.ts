export interface GenAIStep {
  number: string
  title: string
  description: string
  tags: string[]
  deploymentUrl: string | null
  isLearning: boolean
  isNotebook: boolean
}

export const genaiJourneySteps: GenAIStep[] = [
  {
    number: '01',
    title: 'Gemini API Fundamentals',
    description:
      'Started my Generative AI journey by exploring how LLMs work from the ground up. Learned Gemini API fundamentals, prompt engineering, system instructions, temperature tuning, and response customization. Built a personality-driven study assistant and deployed it with a Gradio interface.',
    tags: ['Python', 'Gemini API', 'Prompt Engineering', 'System Instructions', 'Gradio'],
    deploymentUrl: 'https://huggingface.co/RAJAMURUGAN-VS/spaces',
    isLearning: false,
    isNotebook: false,
  },
  {
    number: '02',
    title: 'Tool Calling & Function Calling',
    description:
      'Explored how LLMs invoke external tools by implementing function calling with Groq and Llama 3.3. Built a weather assistant that calls live APIs, processes tool outputs, and generates contextual responses — turning a language model into a functional agent.',
    tags: ['Groq', 'Llama 3.3', 'Function Calling', 'Tool Calling', 'OpenWeatherMap', 'Gradio'],
    deploymentUrl: 'https://huggingface.co/RAJAMURUGAN-VS/spaces',
    isLearning: false,
    isNotebook: false,
  },
  {
    number: '03',
    title: 'LangChain Foundations',
    description:
      "Learned LangChain's core abstractions: chat models, message objects, document loaders, text splitters, embeddings, and vector stores. Built document processing pipelines and retrieval workflows, understanding the architectural building blocks behind modern AI applications.",
    tags: ['LangChain', 'Chat Models', 'Document Loaders', 'Text Splitters', 'Embeddings', 'Chroma'],
    deploymentUrl: null,
    isLearning: false,
    isNotebook: true,
  },
  {
    number: '04',
    title: 'Retrieval-Augmented Generation',
    description:
      'Built complete RAG pipelines from document ingestion to answer generation. Implemented chunking strategies, semantic retrieval with vector databases, context injection, and source citation. Shipped a PDF question-answering assistant that grounds every response in the uploaded document.',
    tags: ['RAG', 'LangChain', 'Chroma', 'HuggingFace Embeddings', 'Gemini', 'Semantic Search'],
    deploymentUrl: 'https://huggingface.co/RAJAMURUGAN-VS/spaces',
    isLearning: false,
    isNotebook: false,
  },
  {
    number: '05',
    title: 'Agentic AI',
    description:
      'Currently exploring autonomous AI systems — agent workflows, memory, multi-step planning, and orchestration. Next: LangGraph for stateful multi-agent systems, and deploying AegisClaim as the first production agentic application.',
    tags: ['Agentic AI', 'LangGraph', 'AI Agents', 'Memory', 'Orchestration', 'Multi-Agent'],
    deploymentUrl: null,
    isLearning: true,
    isNotebook: false,
  },
]

// Legacy alias for GenAIJourney.tsx which imports genAIStages
export const genAIStages = genaiJourneySteps

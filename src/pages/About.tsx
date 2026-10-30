const DSA = [
  {
    title: 'Graph',
    body: 'Campus locations are vertices and the walkable connections between them are edges. PathGrid uses an undirected, unweighted graph.',
  },
  {
    title: 'Queue',
    body: 'BFS uses a FIFO queue to decide which location to explore next — nodes leave from the front and newly discovered ones join the rear.',
  },
  {
    title: 'BFS',
    body: 'Breadth-First Search explores the graph level by level from the start, so it finds a route with the fewest edges in an unweighted graph.',
  },
  {
    title: 'Priority Queue',
    body: 'A separate structure that ranks campus locations by an assigned priority (their number of connections) — used by Nearby Places, not for routing.',
  },
]

const VIVA = [
  ['What data structure represents the campus?', 'A graph — locations are vertices, connections are edges.'],
  ['Which algorithm finds the route?', 'Breadth-First Search (BFS).'],
  ['Which data structure does BFS use?', 'A queue.'],
  ['What does a queue follow?', 'FIFO — First In, First Out.'],
  ['What does BFS do?', 'It explores the graph level by level from the source.'],
  [
    'Why can BFS find the shortest path?',
    'In an unweighted graph, BFS reaches nodes in increasing number of edges from the source, so the first time it reaches the destination is via a fewest-edge path.',
  ],
  [
    'Why not Dijkstra?',
    'The graph is unweighted and this project is scoped to BFS; Dijkstra is for weighted graphs.',
  ],
  ['What is the Priority Queue used for?', 'Prioritizing campus locations, separately from route finding.'],
]

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section>
        <h1 className="text-2xl font-bold text-ink">About PathGrid</h1>
        <p className="mt-2 text-muted">
          PathGrid is an interactive campus navigation system built to demonstrate
          fundamental Data Structures and Algorithms. The Java backend owns all DSA logic;
          this frontend visualizes it.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">DSA Used</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DSA.map((d) => (
            <div key={d.title} className="rounded-2xl border border-border bg-surface p-4">
              <p className="font-semibold text-accent">{d.title}</p>
              <p className="mt-1 text-sm text-muted">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Quick Q&amp;A</h2>
        <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {VIVA.map(([q, a]) => (
            <div key={q} className="p-4">
              <dt className="font-medium text-ink">{q}</dt>
              <dd className="mt-1 text-sm text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

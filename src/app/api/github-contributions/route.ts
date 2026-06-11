import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'RAJAMURUGAN-VS'

const QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year') || 'last'

  let from: string
  let to: string

  if (year === 'last') {
    const now = new Date()
    to = now.toISOString()
    const yearAgo = new Date()
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    from = yearAgo.toISOString()
  } else {
    from = `${year}-01-01T00:00:00Z`
    to = `${year}-12-31T23:59:59Z`
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'No GitHub token configured' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { username: GITHUB_USERNAME, from, to } }),
      next: { revalidate: 3600 },
    })

    const data = await response.json()

    if (data.errors) {
      return NextResponse.json({ error: 'GitHub API error', details: data.errors }, { status: 500 })
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar
    return NextResponse.json(calendar)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

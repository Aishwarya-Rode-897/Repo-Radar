import { validateApiKey } from '@/lib/supabase';
import { generateRepoSummary } from '@/lib/langchain';
import { NextResponse } from 'next/server';

// Function to validate GitHub repository URL format
function isValidGitHubUrl(url: string): { isValid: boolean; owner?: string; repo?: string } {
  try {
    const githubUrlPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/;
    const match = url.match(githubUrlPattern);
    
    if (!match) {
      return { isValid: false };
    }

    const [, owner, repo] = match;
    return { 
      isValid: true, 
      owner, 
      repo: repo.replace('.git', '') 
    };
  } catch {
    return { isValid: false };
  }
}

// Function to format README content
function formatReadmeContent(content: string): {
  title: string;
  description: string;
  sections: { heading: string; content: string }[];
} {
  // Split content into lines
  const lines = content.split('\n');
  
  // Initialize variables
  let title = '';
  let description = '';
  const sections: { heading: string; content: string }[] = [];
  let currentSection = { heading: '', content: '' };
  
  // Process each line
  lines.forEach((line, index) => {
    // Clean the line
    const cleanLine = line.trim();
    
    // Skip empty lines at the start
    if (cleanLine === '' && !title) return;
    
    // Find the title (first # or first non-empty line)
    if (!title) {
      title = cleanLine.replace(/^#\s*/, '').trim();
      return;
    }
    
    // Get description (text between title and first section)
    if (!description && !cleanLine.startsWith('#')) {
      if (cleanLine) {
        description += cleanLine + ' ';
      }
      return;
    }
    
    // Handle sections
    if (cleanLine.startsWith('#')) {
      // Save previous section if exists
      if (currentSection.heading && currentSection.content) {
        sections.push({ ...currentSection });
      }
      
      // Start new section
      currentSection = {
        heading: cleanLine.replace(/^#+\s*/, '').trim(),
        content: ''
      };
    } else if (cleanLine || index === lines.length - 1) {
      // Add content to current section
      if (currentSection.heading) {
        currentSection.content += cleanLine + '\n';
      } else {
        description += cleanLine + ' ';
      }
    }
  });
  
  // Add the last section if exists
  if (currentSection.heading && currentSection.content) {
    sections.push(currentSection);
  }
  
  return {
    title: title || 'Untitled Repository',
    description: description.trim(),
    sections: sections.map(section => ({
      heading: section.heading,
      content: section.content.trim()
    }))
  };
}

// Function to fetch README content from GitHub
async function fetchReadmeContent(owner: string, repo: string): Promise<string> {
  try {
    // First try to fetch the README.md
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Repo-Radar'
        }
      }
    );

    if (response.ok) {
      return await response.text();
    }

    // If README.md not found, try README
    const fallbackResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/README`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Repo-Radar'
        }
      }
    );

    if (fallbackResponse.ok) {
      return await fallbackResponse.text();
    }

    throw new Error('README not found in repository');
  } catch (error: any) {
    throw new Error(`Failed to fetch README: ${error.message}`);
  }
}

export async function POST(request: Request) {
  try {
    // Extract API key from headers
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required in x-api-key header' },
        { status: 401 }
      );
    }

    // Validate the API key
    const isValid = await validateApiKey(apiKey);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const { isValid: isValidUrl, owner, repo } = isValidGitHubUrl(repoUrl);
    if (!isValidUrl || !owner || !repo) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format. Expected format: https://github.com/owner/repo' },
        { status: 400 }
      );
    }

    // Fetch README content
    const rawReadmeContent = await fetchReadmeContent(owner, repo);
    
    // Format the README content
    const formattedContent = formatReadmeContent(rawReadmeContent);

    // Generate AI summary using LangChain
    const aiSummary = await generateRepoSummary(formattedContent);

    const response = {
      repoUrl,
      owner,
      repo,
      summary: aiSummary.summary,
      cool_facts: aiSummary.cool_facts,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
} 
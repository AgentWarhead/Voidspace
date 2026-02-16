import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, rotateSessionIfNeeded } from '@/lib/auth/verify-request';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/sanctum-projects';
import { canCreateProject, SANCTUM_TIERS, type SanctumTier } from '@/lib/sanctum-tiers';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/sanctum/projects — list user's projects
export async function GET(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await listProjects(auth.accountId);
  const response = NextResponse.json({ projects });
  rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
  return response;
}

// POST /api/sanctum/projects — create new project
export async function POST(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, category, code, mode, concepts_learned } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
    }

    // ── Enforce project limit based on tier ──
    const supabase = createAdminClient();
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', auth.userId)
      .single();
    const userTier: SanctumTier = (sub?.tier as SanctumTier) || 'shade';

    const existingProjects = await listProjects(auth.accountId);
    if (!canCreateProject(userTier, existingProjects.length)) {
      const tierConfig = SANCTUM_TIERS[userTier];
      return NextResponse.json(
        {
          error: `Project limit reached (${tierConfig.maxProjects} for ${tierConfig.name} tier). Upgrade to create more projects.`,
          code: 'PROJECT_LIMIT',
          currentCount: existingProjects.length,
          maxProjects: tierConfig.maxProjects,
          tier: userTier,
        },
        { status: 403 }
      );
    }

    const project = await createProject({
      user_id: auth.accountId,
      name,
      description,
      category,
      code,
      mode,
      concepts_learned,
    });

    if (!project) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    const response = NextResponse.json({ project });
    rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT /api/sanctum/projects — update project
export async function PUT(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, description, category, code, mode, concepts_learned } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await updateProject(id, auth.accountId, {
      name,
      description,
      category,
      code,
      mode,
      concepts_learned,
    });

    if (!project) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    const response = NextResponse.json({ project });
    rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/sanctum/projects — delete project
export async function DELETE(request: NextRequest) {
  const auth = getAuthenticatedUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const success = await deleteProject(id, auth.accountId);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    rotateSessionIfNeeded(response, auth.userId, auth.accountId, auth.shouldRotate);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

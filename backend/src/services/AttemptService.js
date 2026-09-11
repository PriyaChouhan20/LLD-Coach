export class AttemptService {
  constructor(attemptRepository, problemRepository, evaluationService) {
    this.attemptRepository = attemptRepository;
    this.problemRepository = problemRepository;
    this.evaluationService = evaluationService;
  }

  async getOrCreateAttempt(problemSlug, userId = 'anonymous-learner', forceNew = false) {
    const problem = await this.problemRepository.findBySlug(problemSlug);
    if (!problem) {
      throw new Error(`Problem with slug "${problemSlug}" not found.`);
    }

    // Check if there is an in-progress attempt for this problem unless forceNew is true
    if (!forceNew) {
      const existingAttempts = await this.attemptRepository.findByProblemAndUser(problem.id, userId);
      const inProgress = existingAttempts.find(a => a.status === 'IN_PROGRESS');
      if (inProgress) {
        return inProgress;
      }
    }

    // Create a new fresh attempt initialized with starter template
    const newAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      problemId: problem.id,
      problemSlug: problem.slug,
      problemTitle: problem.title,
      userId,
      status: 'IN_PROGRESS',
      currentDraft: {
        designExplanation: problem.starterTemplate?.designExplanation || '',
        classDesign: problem.starterTemplate?.classDesign || '',
        codeSnippet: problem.starterTemplate?.codeSnippet || '',
        tradeoffs: problem.starterTemplate?.tradeoffs || '',
      },
      submissions: [],
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    return this.attemptRepository.save(newAttempt);
  }

  async saveDraft(attemptId, draft) {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with id "${attemptId}" not found.`);
    }

    attempt.currentDraft = {
      designExplanation: draft.designExplanation ?? attempt.currentDraft?.designExplanation ?? '',
      classDesign: draft.classDesign ?? attempt.currentDraft?.classDesign ?? '',
      codeSnippet: draft.codeSnippet ?? attempt.currentDraft?.codeSnippet ?? '',
      tradeoffs: draft.tradeoffs ?? attempt.currentDraft?.tradeoffs ?? '',
    };
    attempt.updatedAt = new Date();

    return this.attemptRepository.save(attempt);
  }

  async submitAttempt(attemptId, content) {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with id "${attemptId}" not found.`);
    }

    const problem = await this.problemRepository.findById(attempt.problemId) 
      || (attempt.problemSlug ? await this.problemRepository.findBySlug(attempt.problemSlug) : null);
    if (!problem) {
      throw new Error(`Associated problem not found for attempt "${attemptId}".`);
    }

    const version = attempt.submissions.length + 1;
    const submissionId = `sub_${Date.now()}_v${version}`;

    const newSubmission = {
      id: submissionId,
      attemptId: attempt.id,
      problemId: problem.id,
      version,
      content: { ...content },
      evaluationStatus: 'EVALUATING',
      submittedAt: new Date(),
    };

    // Run evaluation pipeline
    let evaluationResult;
    try {
      evaluationResult = await this.evaluationService.evaluateSubmission(problem, newSubmission);
      newSubmission.evaluationStatus = 'COMPLETED';
      newSubmission.evaluationResult = evaluationResult;
    } catch (err) {
      newSubmission.evaluationStatus = 'FAILED';
      newSubmission.errorMessage = err.message || 'Evaluation encountered an unexpected failure.';
      throw err;
    }

    // Update attempt state
    attempt.submissions.push(newSubmission);
    attempt.status = 'EVALUATED';
    attempt.latestScore = evaluationResult.overallScore;
    attempt.latestVerdict = evaluationResult.verdict;
    attempt.currentDraft = { ...content };
    attempt.updatedAt = new Date();

    const savedAttempt = await this.attemptRepository.save(attempt);

    return {
      attempt: savedAttempt,
      submission: newSubmission,
      evaluationResult,
    };
  }

  async getAttemptById(id) {
    return this.attemptRepository.findById(id);
  }

  async getUserHistory(userId = 'anonymous-learner') {
    return this.attemptRepository.findByUserId(userId);
  }
}

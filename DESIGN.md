# OMEGA® Swiss Luxury Watches Since 1848

## Mission
Create implementation-ready, token-driven UI guidance for OMEGA® Swiss Luxury Watches Since 1848 that is optimized for consistency, accessibility, and fast delivery across e-commerce storefront.

## Brand
- Product/brand: OMEGA® Swiss Luxury Watches Since 1848
- URL: https://www.omegawatches.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=omegact`, `font.family.stack=omegact, arial, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=14px`, `font.size.xl=16px`, `font.size.2xl=17px`, `font.size.3xl=20px`, `font.size.4xl=21px`
- Color palette: `color.text.primary=#555555`, `color.text.secondary=#c40d2e`, `color.text.tertiary=#ffffff`, `color.text.inverse=#e5e5e5`, `color.surface.base=#000000`, `color.surface.raised=#f9f9f9`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=5px`, `space.4=7px`, `space.5=8px`, `space.6=10px`, `space.7=12px`, `space.8=15px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=50px` | `shadow.1=rgb(196, 13, 46) 0px 0px 0px 0px inset`, `shadow.2=rgb(255, 255, 255) 0px 0px 0px 0px inset`, `shadow.3=rgba(33, 33, 33, 0.48) -16px 16px 64px 0px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (30), buttons (27), inputs (10), lists (2).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.

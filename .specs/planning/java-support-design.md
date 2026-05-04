# Design: Java Language Support for SpecPilot

**Status:** Accepted  
**Date:** 2026-05-04  
**Author:** SpecPilot Design Session  
**Related Issues:** Java support request (May 2026)

---

## Understanding Summary

- **What is being built**: First-class support for Java (with Spring Boot as the initial framework) in the SpecPilot CLI, so users can run `specpilot init my-app --lang java [--framework spring-boot]`.
- **Why it exists**: Provide the same specification-driven scaffolding experience (`.specs/` folder + onboarding prompts + IDE settings) that currently exists for TypeScript, JavaScript, and Python.
- **Who it is for**: Java developers who want to adopt SpecPilot’s SDD workflow without manual template copying or missing language-specific guidance.
- **Key constraints**:
  - Only `.specs/` scaffolding is generated (no `pom.xml`, no `Application.java`, no source folders) — consistent with current behavior for all languages.
  - Maven is the assumed build tool; Gradle support is deferred.
  - Full IDE parity (VSCode, Cursor, Windsurf, Antigravity, etc.) must be included.
- **Explicit non-goals**:
  - No generation of runnable Java project skeletons.
  - No Quarkus, Micronaut, or other frameworks in the initial implementation.
  - No changes to the `.specs/` folder structure or file naming conventions.

---

## Assumptions

- The existing partial Java entries in `list.ts` were intended as a stub and should be made fully functional.
- Language detection (`projectDetector.ts`) and validation logic do not need Java-specific changes for the initial release (Java projects will primarily be initialized, not auto-detected from existing codebases).
- Template content for Java will be minimal at first (generic + spring-boot variants of `project.yaml` and `architecture.md`), following the same pattern as Python.
- Adding Java will require updates to: `cli.ts` (help text), `init.ts`, `add-specs.ts` (supportedLanguages array), `frameworks.ts`, `templateEngine.ts`, and documentation (`docs/GUIDE.md`, README.md).
- All existing tests must continue to pass; new tests will be added for the Java path.

---

## Final Design (Approach A — Minimal Surface Extension)

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `src/utils/frameworks.ts` | Modify | Add `java: ['spring-boot']` to the language map |
| `src/commands/init.ts` | Modify | Add `'java'` to `supportedLanguages` array |
| `src/commands/add-specs.ts` | Modify | Add `'java'` to `supportedLanguages` array |
| `src/cli.ts` | Modify | Update `--lang` help text to include `java` |
| `src/commands/list.ts` | Minor fix | Ensure Java entries are consistent with other languages |
| `src/utils/templateEngine.ts` | Modify | Add `java` and `java-spring-boot` template variants for `project.yaml` and `architecture.md` |
| `docs/GUIDE.md` | Modify | Update supported languages table |
| `README.md` | Modify | Add Java + Spring Boot to the Supported Languages section |
| `src/__tests__/templateEngine.test.ts` | Extend | Add tests for Java templates (similar to Python tests) |

### Template Strategy

- Extend `getProjectYamlTemplate(language, framework?)` with an `if (language === 'java')` branch.
- Extend `getArchitectureTemplate(language, framework?)` similarly.
- Register four new template keys:
  - `java-project.yaml`
  - `java-spring-boot-project.yaml`
  - `java-architecture.md`
  - `java-spring-boot-architecture.md`
- Default framework for Java is `spring-boot`.
- No new files created; all changes are in-place extensions.

### CLI Surface Updates

- `cli.ts`: Update option description to `(typescript, javascript, python, java)`
- `init.ts` and `add-specs.ts`: Add `'java'` to the supported languages whitelist.
- `list.ts`: Java entries already present; minor consistency pass only.

### Documentation Updates

- README.md: Add Java section under “Supported Languages & Frameworks”.
- docs/GUIDE.md: Update `--lang` flag descriptions in command tables.

### Testing Strategy

- Add four new test cases inside the existing `templateEngine.test.ts` file, mirroring the Python test pattern.
- Run full test suite (`npm test`) after changes; zero regression required.
- No new test files created.

### Error Handling

- Unsupported Java frameworks (e.g., `--framework quarkus`) produce a clear error:  
  `Error: Framework 'quarkus' is not supported for Java. Supported frameworks: spring-boot`
- Invalid language combinations continue to use existing error paths.
- No new exception classes introduced.

---

## Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|----------|--------------------------|---------|
| 1 | Support Java via `init --lang java --framework spring-boot` | Supporting multiple frameworks from day one (Quarkus, Micronaut) | YAGNI — Spring Boot is the most requested and most widely used; other frameworks can be added later without breaking changes |
| 2 | Generate **only** `.specs/` scaffolding (no `pom.xml`, no source folders) | Also generate a minimal runnable Spring Boot skeleton | Maintains consistency with TypeScript/Python behavior; keeps scope minimal and focused on specification-driven workflow |
| 3 | Use **Maven** as the assumed build tool | Support both Maven and Gradle via flag | Reduces initial complexity; Gradle can be added later if demand appears |
| 4 | Full IDE parity (VSCode, Cursor, Windsurf, Antigravity, etc.) | Skip IDE settings for Java initially | Users expect the same experience as other languages; the generator already supports multi-IDE output |
| 5 | **Approach A — Minimal Surface Extension** | Dedicated `javaTemplateProvider.ts` or full plugin registry | Lowest risk, fastest to ship, follows the exact pattern used when Python support was added |
| 6 | Extend existing `getProjectYamlTemplate` / `getArchitectureTemplate` with `if (language === 'java')` branches | Create separate `getJava*` methods | Keeps `templateEngine.ts` small and consistent; refactoring can happen later if more Java frameworks are added |
| 7 | Add new tests only inside `templateEngine.test.ts` | Create a new `javaTemplate.test.ts` file | Mirrors how Python tests were added; avoids unnecessary file proliferation |
| 8 | Update help text and docs to list `java` alongside existing languages | Leave docs unchanged until later | Prevents user confusion and ensures discoverability |

---

## Open Questions

None — all questions were resolved during the design session.

---

## Exit Criteria Met

- [x] Understanding Lock confirmed by user
- [x] Design approach explicitly accepted (Approach A)
- [x] Major assumptions documented
- [x] Key risks acknowledged (minimal surface changes, no new dependencies)
- [x] Decision Log complete

**Ready to set up for implementation?** (Yes / No)
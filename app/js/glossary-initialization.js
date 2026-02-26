// Initialize glossary functionality upon page load
import { glossaryTerms } from "./glossary-terms.js";
import { identifyGlossaryMatches, 
        highlightGlossaryTerms, 
        renderGlossary, 
        attachGlossaryTooltips } from "./glossary-functions.js";

export default function initGlossary(contentContainer, glossaryContainer) {
  if (!contentContainer || !glossaryContainer || !glossaryTerms) return;

  const matches = identifyGlossaryMatches(contentContainer.textContent, glossaryTerms);
  highlightGlossaryTerms(contentContainer, matches);
  renderGlossary(matches, glossaryContainer);
  attachGlossaryTooltips(contentContainer);
}

const { execSync } = require('child_process');
execSync("git checkout -- frontend/src/components/social-card/SocialCardStudio.tsx");

const fs = require('fs');
const file = 'frontend/src/components/social-card/SocialCardStudio.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace nested t() calls that cause undefined text returns due to how react-i18next v17 handles defaultValue config objects
content = content.replace(
  "<span>{t('button.submit', { defaultValue: t('preview.submitReview', 'Submit for Review') })}</span>",
  "<span className=\"text-deep-ocean group-hover:text-deep-ocean\">{t('button.submit', 'Submit for Review')}</span>"
);

content = content.replace(
  "<span>{t('button.submitting', { defaultValue: t('preview.submitting', 'Submitting...') })}</span>",
  "<span className=\"text-deep-ocean group-hover:text-deep-ocean\">{t('button.submitting', 'Submitting...')}</span>"
);

content = content.replace(
  "<span>{t('button.submitted', { defaultValue: t('preview.submitted', 'Submitted for Review ✓') })}</span>",
  "<span className=\"text-deep-ocean group-hover:text-deep-ocean\">{t('button.submitted', 'Submitted for Review ✓')}</span>"
);

content = content.replace(
  "<span>{t('button.download', { defaultValue: t('preview.downloadPng', 'Download PNG (1080×1080)') })}</span>",
  "<span className=\"text-white\">{t('button.download', 'Download PNG (1080×1080)')}</span>"
);

fs.writeFileSync(file, content);

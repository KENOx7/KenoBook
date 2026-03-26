export async function fetchAndTranslateMetadata(url) {
  if (!url) throw new Error('Zəhmət olmasa əvvəlcə URL daxil edin.');
  
  try {
    let rawTitle = '';
    let rawDesc = '';

    if (url.includes('github.com')) {
      const match = url.match(/github\.com\/([^/]+\/[^/?#]+)/);
      if (match) {
        const repoPath = match[1];
        try {
          const ghRes = await fetch(`https://api.github.com/repos/${repoPath}`);
          if (ghRes.ok) {
            const data = await ghRes.json();
            rawTitle = data.name || data.full_name;
            rawDesc = data.description || '';
          }
        } catch (e) {
          console.warn('GitHub API xətası, normal yolla davam edilir...', e);
        }
      }
    }

    if (!rawTitle && !rawDesc) {
      const metaRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      if (!metaRes.ok) throw new Error('Baza xətası və ya keçid etibarsızdır.');
      
      const metaData = await metaRes.json();
      if (metaData.status !== 'success') throw new Error('Məlumat tapılmadı.');

      rawTitle = metaData.data?.title || '';
      rawDesc = metaData.data?.description || '';

      if (rawTitle.length > 50) {
        if (rawTitle.includes(':')) rawTitle = rawTitle.split(':')[0].trim();
        else if (rawTitle.includes('|')) rawTitle = rawTitle.split('|')[0].trim();
        else if (rawTitle.includes('-')) rawTitle = rawTitle.split('-')[0].trim();
      }
      
    }

    if (!rawTitle && !rawDesc) throw new Error('Bu saytda kifayət qədər məlumat yoxdur.');

    const translate = async (text) => {
      if (!text) return '';
      try {
        const transRes = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=az&dt=t&q=${encodeURIComponent(text)}`
        );
        const transData = await transRes.json();
        if (transData && transData[0]) {
          return transData[0].map(item => item[0]).join('');
        }
        return text;
      } catch (e) {
        console.warn('Tərcümə xətası:', e);
        return text;
      }
    };

    const azTitle = await translate(rawTitle);
    const azDesc = await translate(rawDesc);

    return {
      title: azTitle || rawTitle,
      description: azDesc || rawDesc
    };
  } catch (error) {
    console.error('Metadata fetching error:', error);
    throw new Error(error.message || 'Avto-doldurma uğursuz oldu: Sayt icazə vermir və ya xəta baş verdi.');
  }
}

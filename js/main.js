// 1. ページ初期化設定（スクロール位置のリセット）
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 共通：トップへスクロールする関数
const scrollToTop = () => window.scrollTo(0, 0);

// 2. メイン処理
document.addEventListener("DOMContentLoaded", () => {
  scrollToTop();

  /**
   * スクロール表示アニメーション (Intersection Observer)
   * ABOUT, WORKS, タイトルなどを一括管理
   */
  const initScrollAnimation = () => {
    const options = {
      root: null,
      rootMargin: "-10% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          // 一度表示されたら監視を終了（動作を軽くする）
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // 監視対象をすべて取得（ABOUT本体, セクションタイトル, JSトリガー要素）
    const targets = document.querySelectorAll('#about, .section-title, .about-section-title, .concept-catch, .js-scroll-trigger');    targets.forEach(target => {
      // 初期化（クラスを一度外して再アニメーションを可能にする）
      target.classList.remove('is-active');
      observer.observe(target);
    });
  };

  /**
   * スムーススクロール制御
   */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // ロゴ（href="#"）の場合はトップへ
        if (href === "#") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // ページ内リンクの場合
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          
          window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // 各機能の実行
  initScrollAnimation();
  initSmoothScroll();

  // 戻るボタン対策 (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      scrollToTop();
      initScrollAnimation();
    }
  });
});

// 3. 全リソース読み込み完了後の最終調整
window.addEventListener('load', scrollToTop);
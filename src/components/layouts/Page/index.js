/** @jsx jsx */
import { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/core';

import { useMediaQuery } from 'hooks/useMediaQuery';
import { Breakpoints } from 'constants/Breakpoints';

import BackButton from 'components/BackButton';
import Header from 'components/Header';
import IntroContent from 'components/IntroContent';
import LargeHeader from 'components/Header/LargeHeader';

import styles from './Page.styles';

const PageContent = ({
  contentContainerStyles,
  children,
  hasBackButton,
  isDesktop,
  onBackButtonClick,
  topPadding,
}) => {
  const paddingStyles = topPadding > 0 && css({ paddingTop: topPadding });

  return (
    <div
      css={[
        styles.pageContentContainer,
        isDesktop && paddingStyles,
        contentContainerStyles,
      ]}
    >
      <div css={styles.pageContent}>
        {hasBackButton && <BackButton onClick={onBackButtonClick} />}
        {children}
      </div>
    </div>
  );
};

const Page = ({
  children,
  contentContainerStyles,
  hasBackButton = true,
  isHome,
  onBackButtonClick,
  currentProgress,
  rootContainerStyles,
  totalProgress,
}) => {
  const [pageContentTopPadding, setPageContentTopPadding] = useState(0);
  const { matchesBreakpoint } = useMediaQuery();

  const isDesktop =
    (`(min-width: ${Breakpoints.LARGE}px)`,
    matchesBreakpoint(Breakpoints.LARGE));
  const willUseSmallHeader = !isHome && !isDesktop;

  const headerRef = useCallback((node) => {
    if (node) {
      setPageContentTopPadding(node.getBoundingClientRect().top);

      window.addEventListener('resize', () =>
        setPageContentTopPadding(node.getBoundingClientRect().top),
      );
    }
  }, []);

  return (
    <div css={[styles.root, rootContainerStyles]}>
      {willUseSmallHeader && (
        <Header
          currentProgress={currentProgress}
          totalProgress={totalProgress}
        />
      )}

      {!willUseSmallHeader && (
        <div css={isDesktop && styles.headerContainerDesktop}>
          <div css={isDesktop && styles.headerContentDesktop} ref={headerRef}>
            <LargeHeader />
            {isDesktop && <IntroContent isDesktop />}
          </div>
        </div>
      )}

      <PageContent
        children={children}
        contentContainerStyles={contentContainerStyles}
        hasBackButton={hasBackButton}
        isDesktop={isDesktop}
        onBackButtonClick={onBackButtonClick}
        topPadding={pageContentTopPadding}
      />
    </div>
  );
};

export default Page;

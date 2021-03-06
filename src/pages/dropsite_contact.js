/** @jsx jsx */
import { useEffect, useState } from 'react';
import { jsx } from '@emotion/core';
import { useHistory, useParams } from 'react-router-dom';

import { Routes } from 'constants/Routes';
import { routeWithParams } from 'lib/utils/routes';
import Page from 'components/layouts/Page';
import PageLoader from 'components/Loader/PageLoader';
import ContactForm from 'containers/ContactForm';

function ContactDropSite({ backend }) {
  const history = useHistory();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dropSite, setDropSite] = useState();

  useEffect(() => {
    backend.getDropSites(params.id).then((data) => {
      setDropSite(data);
      setIsLoading(false);
    });
  }, [backend, params.id]);

  return (
    <Page
      onBackButtonClick={() =>
        history.push(
          routeWithParams(Routes.DROPSITE_ADMIN, {
            id: params.id,
          }),
        )
      }
      currentProgress={4}
      totalProgress={5}
    >
      {isLoading && <PageLoader />}
      {!isLoading && !!dropSite && (
        <ContactForm backend={backend} dropSite={dropSite} />
      )}
    </Page>
  );
}

export default ContactDropSite;

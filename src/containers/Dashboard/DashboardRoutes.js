import React, { lazy, Suspense } from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import Loader from '@iso/components/utility/loader';

const routes = [
  {
    path: '',
    component: lazy(() => import('../DashboardHomePage')),
    exact: true,
  },
  {
    path: 'sponsorships/:sponsorshipId',
    component: lazy(() => import('../Sponsorships/SingleSponsorship')),
  },
  {
    path: 'sponsorships',
    component: lazy(() => import('../Sponsorships/Sponsorships')),
  },
  {
    path: 'authCheck',
    component: lazy(() => import('../AuthCheck')),
  },
];

export default function AppRouter() {
  const { url } = useRouteMatch();
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {routes.map((route, idx) => (
          <Route exact={route.exact} key={idx} path={`${url}/${route.path}`}>
            <route.component />
          </Route>
        ))}
      </Switch>
    </Suspense>
  );
}

import 'babel-polyfill';
import 'bootstrap/dist/js/bootstrap.min';
import { createHistory, useQueries } from 'history';

import app from './../../../shared/app';

app(useQueries(createHistory));

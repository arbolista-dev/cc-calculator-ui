import 'bootstrap/dist/js/bootstrap.min';
import 'iframe-resizer/js/iframeResizer.contentWindow.min';
import { createHistory, useQueries } from 'history';

import app from './../../../shared/app';

app(useQueries(createHistory));

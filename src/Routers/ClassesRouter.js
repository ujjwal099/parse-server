import PromiseRouter from '../PromiseRouter';
import rest from '../rest';
import _ from 'lodash';
import Parse from 'parse/node';
import { promiseEnsureIdempotency } from '../middlewares';

const ALLOWED_GET_QUERY_KEYS = [
  'keys',
  'include',
  'excludeKeys',
  'readPreference',
  'includeReadPreference',
  'subqueryReadPreference',
];

export class ClassesRouter extends PromiseRouter {
  className(req) {
    return req.params.className;
  }

  async handleFind(req) {
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = ClassesRouter.optionsFromBody(body, req.config.defaultLimit);
    if (req.config.maxLimit && body.limit > req.config.maxLimit) {
      // Silently replace the limit on the query with the max configured
      options.limit = Number(req.config.maxLimit);
    }
    if (body.redirectClassNameForKey) {
      options.redirectClassNameForKey = String(body.redirectClassNameForKey);
    }
    if (typeof body.where === 'string') {
      body.where = JSON.parse(body.where);
    }
    const date1 = new Date();
    const second1 = date1.getSeconds();
    const milisecond1 = date1.getMilliseconds();
    const minutes1 = date1.getMinutes();
    const data = await rest
      .find(
        req.config,
        req.auth,
        this.className(req),
        body.where,
        options,
        req.info.clientSDK,
        req.info.context
      )
      .then(response => {
        return { response: response };
      });
    const date2 = new Date();
    const second2 = date2.getSeconds();
    const milisecond2 = date2.getMilliseconds();
    const minutes2 = date2.getMinutes();
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(
      'Minutes',
      minutes2 - minutes1,
      'Second',
      second2 >= second1 ? second2 - second1 : 60 - second1 + second2,
      'Milisecond',
      milisecond2 > milisecond1 ? milisecond2 - milisecond1 : 999 - milisecond1 + milisecond2
    );
    console.log(data);
    return data;
  }

  // Returns a promise for a {response} object.
  async handleGet(req) {
    const body = Object.assign(req.body, ClassesRouter.JSONFromQuery(req.query));
    const options = {};

    for (const key of Object.keys(body)) {
      if (ALLOWED_GET_QUERY_KEYS.indexOf(key) === -1) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Improper encode of parameter');
      }
    }

    if (body.keys != null) {
      options.keys = String(body.keys);
    }
    if (body.include != null) {
      options.include = String(body.include);
    }
    if (body.excludeKeys != null) {
      options.excludeKeys = String(body.excludeKeys);
    }
    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
    }
    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }
    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }
    const date1 = new Date();
    const second1 = date1.getSeconds();
    const milisecond1 = date1.getMilliseconds();
    const minutes1 = date1.getMinutes();
    const data = await rest
      .get(
        req.config,
        req.auth,
        this.className(req),
        req.params.objectId,
        options,
        req.info.clientSDK,
        req.info.context
      )
      .then(response => {
        if (!response.results || response.results.length == 0) {
          throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Object not found.');
        }

        if (this.className(req) === '_User') {
          delete response.results[0].sessionToken;

          const user = response.results[0];

          if (req.auth.user && user.objectId == req.auth.user.id) {
            // Force the session token
            response.results[0].sessionToken = req.info.sessionToken;
          }
        }
        return { response: response.results[0] };
      });
    const date2 = new Date();
    const second2 = date2.getSeconds();
    const milisecond2 = date2.getMilliseconds();
    const minutes2 = date2.getMinutes();
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(
      'Minutes',
      minutes2 - minutes1,
      'Second',
      second2 >= second1 ? second2 - second1 : 60 - second1 + second2,
      'Milisecond',
      milisecond2 > milisecond1 ? milisecond2 - milisecond1 : 999 - milisecond1 + milisecond2
    );
    console.log(data);
    return data;
  }

  async handleCreate(req) {
    const date1 = new Date();
    const second1 = date1.getSeconds();
    const milisecond1 = date1.getMilliseconds();
    const minutes1 = date1.getMinutes();
    const data = await rest.create(
      req.config,
      req.auth,
      this.className(req),
      req.body,
      req.info.clientSDK,
      req.info.context
    );
    const date2 = new Date();
    const second2 = date2.getSeconds();
    const milisecond2 = date2.getMilliseconds();
    const minutes2 = date2.getMinutes();
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(
      'Minutes',
      minutes2 - minutes1,
      'Second',
      second2 >= second1 ? second2 - second1 : 60 - second1 + second2,
      'Milisecond',
      milisecond2 > milisecond1 ? milisecond2 - milisecond1 : 999 - milisecond1 + milisecond2
    );
    console.log(data);

    return data;
  }

  async handleUpdate(req) {
    const where = { objectId: req.params.objectId };
    const date1 = new Date();
    const second1 = date1.getSeconds();
    const milisecond1 = date1.getMilliseconds();
    const minutes1 = date1.getMinutes();
    const data = await rest.update(
      req.config,
      req.auth,
      this.className(req),
      where,
      req.body,
      req.info.clientSDK,
      req.info.context
    );
    const date2 = new Date();
    const second2 = date2.getSeconds();
    const milisecond2 = date2.getMilliseconds();
    const minutes2 = date2.getMinutes();
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(
      'Minutes',
      minutes2 - minutes1,
      'Second',
      second2 >= second1 ? second2 - second1 : 60 - second1 + second2,
      'Milisecond',
      milisecond2 > milisecond1 ? milisecond2 - milisecond1 : 999 - milisecond1 + milisecond2
    );
    console.log(data);
    return data;
  }

  async handleDelete(req) {
    const date1 = new Date();
    const second1 = date1.getSeconds();
    const milisecond1 = date1.getMilliseconds();
    const minutes1 = date1.getMinutes();
    const data = await rest
      .del(req.config, req.auth, this.className(req), req.params.objectId, req.info.context)
      .then(() => {
        return { response: {} };
      });
    const date2 = new Date();
    const second2 = date2.getSeconds();
    const milisecond2 = date2.getMilliseconds();
    const minutes2 = date2.getMinutes();
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(
      'Minutes',
      minutes2 - minutes1,
      'Second',
      second2 >= second1 ? second2 - second1 : 60 - second1 + second2,
      'Milisecond',
      milisecond2 > milisecond1 ? milisecond2 - milisecond1 : 999 - milisecond1 + milisecond2
    );
    console.log(data);

    return data;
  }

  static JSONFromQuery(query) {
    const json = {};
    for (const [key, value] of _.entries(query)) {
      try {
        json[key] = JSON.parse(value);
      } catch (e) {
        json[key] = value;
      }
    }
    return json;
  }

  static optionsFromBody(body, defaultLimit) {
    const allowConstraints = [
      'skip',
      'limit',
      'order',
      'count',
      'keys',
      'excludeKeys',
      'include',
      'includeAll',
      'redirectClassNameForKey',
      'where',
      'readPreference',
      'includeReadPreference',
      'subqueryReadPreference',
      'hint',
      'explain',
    ];

    for (const key of Object.keys(body)) {
      if (allowConstraints.indexOf(key) === -1) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, `Invalid parameter for query: ${key}`);
      }
    }
    const options = {};
    if (body.skip) {
      options.skip = Number(body.skip);
    }
    if (body.limit || body.limit === 0) {
      options.limit = Number(body.limit);
    } else {
      options.limit = Number(defaultLimit);
    }
    if (body.order) {
      options.order = String(body.order);
    }
    if (body.count) {
      options.count = true;
    }
    if (body.keys != null) {
      options.keys = String(body.keys);
    }
    if (body.excludeKeys != null) {
      options.excludeKeys = String(body.excludeKeys);
    }
    if (body.include != null) {
      options.include = String(body.include);
    }
    if (body.includeAll) {
      options.includeAll = true;
    }
    if (typeof body.readPreference === 'string') {
      options.readPreference = body.readPreference;
    }
    if (typeof body.includeReadPreference === 'string') {
      options.includeReadPreference = body.includeReadPreference;
    }
    if (typeof body.subqueryReadPreference === 'string') {
      options.subqueryReadPreference = body.subqueryReadPreference;
    }
    if (body.hint && (typeof body.hint === 'string' || typeof body.hint === 'object')) {
      options.hint = body.hint;
    }
    if (body.explain) {
      options.explain = body.explain;
    }
    return options;
  }

  mountRoutes() {
    this.route('GET', '/classes/:className', req => {
      return this.handleFind(req);
    });
    this.route('GET', '/classes/:className/:objectId', req => {
      return this.handleGet(req);
    });
    this.route('POST', '/classes/:className', promiseEnsureIdempotency, req => {
      return this.handleCreate(req);
    });
    this.route('PUT', '/classes/:className/:objectId', promiseEnsureIdempotency, req => {
      return this.handleUpdate(req);
    });
    this.route('DELETE', '/classes/:className/:objectId', req => {
      return this.handleDelete(req);
    });
  }
}

export default ClassesRouter;

Entity Lookup Service
=====================

As part of the CARES Act, covered entities must provide reports and include subrecipient data that conformms to `federal financial data standards <https://portal.max.gov/portal/assets/public/offm/DataStandardsFinal.htm>`_

To make their task a bit easier, this web service does a lookup in `<SAM.gov>`_, `<USASpending.gov>`_, and (eventually) OpenCorporates to pull information about legal entities that might receive money from the CARES Act.

Usage
-----
This is a `GraphQL API <https://graphql.org>`_ with only one query option. You can query an `entity` with a `duns` argument.

.. image:: https://user-images.githubusercontent.com/4153048/81618955-1b4f5d00-93ae-11ea-8db8-ef950b83bf36.png

Installation
------------

1. Get a SAM.gov API key from here: https://gsa.github.io/sam_api/sam/key
2. Install the service as follows::

    git clone https://github.com/usdigitalresponse/entity-api.git
    cd entity-api
    echo "SAM_API_KEY=xyz" > .env
    npm install
    npm start

3. Go to `<http://localhost:4000>`_ and query away!

License
-------
`Apache 2.0 <./LICENSE>`_
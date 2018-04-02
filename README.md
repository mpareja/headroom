# headroom

## Initializing the Data Store

```
DIR="datastore/2018-04-02"
bin/visit-api.js $DIR
bin/get-audio.sh $DIR "0,1,2,3,4,5,6,7,8,9,10,30"
```

### Safely Applying Updates

Shares pulls new metadata and adds new media to shared media directory.

```
DIR="datastore/2018-04-02"
bin/visit-api.js $DIR

ORIG="datastore/2018-03-13"
ln -rs "$ORIG/media/ "$DIR/media"
bin/get-audio.sh $DIR "0,1,2,3,4,5,6,7,8,9,10,30"
```

## Maintainers

  + Mario Pareja (pareja.mario@gmail.com)

const MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    express = require('express'),
    engines = require('consolidate'),

    fs = require('fs');

var app = express(),
    db;

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

//Conectarse a la base de datos
MongoClient.connect(`mongodb+srv://cluster0-fxkcz.mongodb.net/test`, {
        auth: {
            user: 'polagmnoz',
            password: 'p964908.'
        }

    },
    function (err, client) {
        if (err) {
            throw err;
        } else {

            db = client.db('OmocatProducts');
            //iniciar servidor
            var server = app.listen(process.env.PORT || 1889);
        }
    });
app.get('/', (req, res) => {
    res.render('viz'); //fin res.render
});

app.get('/home', (req, res) => {
    res.render('index'); //fin res.render
});
app.get('/store', (req, res) => {

    var product = db.collection('sweaters')
        .find();

    if (req.query.artista)
        product.filter({
            artista: req.query.artista
        });

    if (req.query.color)
        product.filter({
            color: req.query.color
        });

    if (req.query.color)
        product.filter({
            color: req.query.color
        });

    if (req.query.min & req.query.max) {
        var {
            min,
            max
        } = req.query;
        console.log(max)

        product.filter({
                precio: {
                    $gt: parseFloat(min - 1),
                    $lt: parseFloat(max + 1)
                }
            }

        );
    }



    product.toArray((err, result) => {
        res.render('store', {
            sweaters: result
        }); //fin res.render
    });

}); //fin get


app.get('/checkout', (req, res) => {

    res.render('checkout'); //fin res.render

});

app.get('/sweater/:id', (req, res) => {
    db.collection('sweaters').find({
            uri_name: req.params.id
        })
        .toArray((err, result) => {
            //res.render(result) //fin res.render
            res.render('sweater_detail', {
                prod: result
            });
        });
});

app.get('/viz', (req, res) => {

    res.render('viz', {});

});

app.get('/productosPorIds', (req, res) => {
    console.log('asdas' + req.query.ids);
    /*  res.send({
          mensaje: 'ok, todo esta bien'
      });*/

    var arreglo = req.query.ids.split(',');
    arreglo = arreglo.map(function (id) {
        return new ObjectID(id);
    });
    var product = db.collection('sweaters')
        .find({
            _id: {
                $in: arreglo
            }
        })
        .toArray((err, result) => {
            res.send(result);
        });
});
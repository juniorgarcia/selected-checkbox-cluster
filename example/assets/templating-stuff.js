let data = {
    brands: [
        'Apple',
        'Samsung',
        'Motorola',
        'Lenovo',
        'Sony',
        'ZTE',
        'Xiaomi'
    ],
    features: [
        'Bluetooth',
        'MP3',
        'Slow-motion video',
        'Water resistant',
        'Built-in coffee maker',
        'Notch'
    ],
    products: [
        {
            name: 'iPhone 6S',
            price: 199.00
        },
        {
            name: 'iPhone 6S Plus',
            price: 219.00
        },
        {
            name: 'iPhone 7',
            price: 249.00
        },
        {
            name: 'iPhone 6S',
            price: 199.00
        },
        {
            name: 'iPhone 6S Plus',
            price: 219.00
        },
        {
            name: 'iPhone 7',
            price: 249.00
        },
        {
            name: 'iPhone 6S',
            price: 199.00
        },
        {
            name: 'iPhone 6S Plus',
            price: 219.00
        },
        {
            name: 'iPhone 7',
            price: 249.00
        }
    ]
},
    brandsTemplate = $('#brands-listing-template').html(),
    featuresTemplate = $('#features-listing-template').html(),
    productsTemplate = $('#products-listing-template').html();

$('#brands-listing').html(Mustache.render(brandsTemplate, data));
$('#features-listing').html(Mustache.render(featuresTemplate, data));
$('#products-listing').html(Mustache.render(productsTemplate, data));
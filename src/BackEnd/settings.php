<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
        'database'=>[
            'connection' => "pgsql:port=5432;host=localhost;dbname=SoulHand-data",
            "user"=>"phpconnect",
            "password"=>"123"
        ],
        'test_database'=>[
            'connection' => "pgsql:port=5432;host=localhost;dbname=SoulHand-testing",
            "user"=>"phpconnect",
            "password"=>"123"
        ]
    ],
];

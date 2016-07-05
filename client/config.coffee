exports.config =
    plugins:
        jade:
            globals: ['t']

    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
            order:
                # Files in `vendor` directories are compiled before other files
                # even if they aren't specified in order.
                before: [
                    'vendor/javascripts/modernizr-2.8.3.js'
                    'vendor/javascripts/jquery-2.1.4.min.js'
                    'vendor/javascripts/underscore-1.8.3.min.js'
                    'vendor/javascripts/backbone-1.2.1.min.js'
                    'vendor/javascripts/bootstrap-3.3.5.min.js'
                    'vendor/javascripts/pnotify-2.0.1.min.js'
                ]

        stylesheets:
            joinTo: 'stylesheets/app.css'
            order:
                before: ['vendor/stylesheets/font-awesome-4.3.0.min.css']
                after: [
                    'vendor/stylesheets/bootstrap-3.3.5.min.css'
                    'vendor/stylesheets/bootstrap-theme-3.3.5.min.css'
                    'vendor/stylesheets/pnotify-2.0.1.min.css'
                    'vendor/stylesheets/helpers.css'
                ]
        templates:
            defaultExtension: 'jade'
            joinTo: 'javascripts/app.js'

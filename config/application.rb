require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BioModelosV2
  class Application < Rails::Application
    # Upgrading from Rails 4.2 to Rails 5.0, the next sentence is used to remove
    # the deprecation warning by "false" value returned by a "before" callback.
    # Check https://edgeguides.rubyonrails.org/upgrading_ruby_on_rails.html#halting-callback-chains-via-throw-abort
    # and https://github.com/rails/rails/pull/17227 for more details.
    ActiveSupport.halt_callback_chains_on_return_false = false
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.default_locale = :es
    
    config.encoding = "utf-8"

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    # Adding bower_components to asset pipeline
    config.assets.paths << Rails.root.join('vendor', 'assets', 'bower_components')

    config.before_configuration do
      env_file = File.join(Rails.root, 'config', 'local_env.yml')
      YAML.load(File.open(env_file)).each do |key, value|
        ENV[key.to_s] = value
      end if File.exists?(env_file)
    end

  end
end

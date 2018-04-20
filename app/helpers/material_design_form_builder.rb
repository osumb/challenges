class MaterialDesignFormBuilder < ActionView::Helpers::FormBuilder
  def text_field(method, options = {})
    text_layout(method, options) do |m, opts|
      super(m, opts)
    end
  end

  def password_field(method, options = {})
    options[:label] = '••••••••'
    text_layout(method, options) do |m, opts|
      super(m, opts)
    end
  end

  def submit(action, options = {})
    classes = options.fetch(:class, [])
    default_options = { class: (classes + ['mdc-button', 'mdc-button-primary', 'challenges-button-secondary']).uniq }
    super(action, options.merge(default_options))
  end

  private

  def text_layout(method, options) # rubocop:disable Metrics/MethodLength
    label_text = options.fetch(:label, method.to_s.humanize)
    label_options = options.fetch(:label_options, {}).merge(
      class: ['mdc-textfield', 'mdc-textfield--upgraded', 'challenges--js__form_label']
    )
    input_defaults = { class: 'mdc-textfield__input' }
    input_options = input_defaults.merge(options.fetch(:input_options, {}))
    span = @template.content_tag :span, class: 'mdc-textfield__label' do
      label_text
    end

    @template.content_tag :label, label_options do
      yield(method, input_options) + span
    end
  end
end

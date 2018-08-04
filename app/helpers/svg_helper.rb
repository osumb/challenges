module SvgHelper
  def self.render(file_name)
    File.open(Rails.root.join("app", "assets", "images", "svg", file_name)) do |file|
      file.read.html_safe # rubocop:disable Rails/OutputSafety
    end
  end
end

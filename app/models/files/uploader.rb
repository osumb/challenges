module Files
  module Uploader
    def self.temporarily_save_file(original_file)
      file_path = Rails.root.join('tmp', original_file.original_filename)

      File.open(file_path, 'wb') do |file|
        file.write(original_file.read)
      end

      file_path
    end

    def self.remove_temporary_file(file_path)
      File.delete(file_path)
    end
  end
end

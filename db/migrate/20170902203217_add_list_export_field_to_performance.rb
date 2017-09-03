class AddListExportFieldToPerformance < ActiveRecord::Migration[5.0]
  def change
    add_column :performances, :list_exported, :boolean, default: false
  end
end

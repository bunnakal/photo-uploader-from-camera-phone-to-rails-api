class CreatePropertyImages < ActiveRecord::Migration
  def change
    create_table :property_images do |t|
      t.text :image
      t.text :description
      t.references :property, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

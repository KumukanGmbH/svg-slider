require 'ruby-batik'

transcoder = Batik::Transcoder.new
svg = File.read(File.dirname(__FILE__) + '/33-14.svg').to_s

File.open('new.png', 'wb+') { |fp|
  fp.write(transcoder.to_png(svg))
}

# require "RMagick"

# svg_string = File.read('33-14.svg')

# img = Magick::Image.from_blob(svg_string.to_s) {
#   self.format = 'SVG'
#   #self.background_color = 'transparent'
# }


# image = img[0].to_blob {self.format = 'PNG'}

# File.open("33-14.png", 'wb') do |f|
#   f.write image
# end
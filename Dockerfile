# Use Ubuntu as the base image
FROM ubuntu:latest

# Set environment variables
ENV GEM_HOME="/root/gems"
ENV PATH="/root/gems/bin:$PATH"

# Install dependencies and set up Ruby environment
RUN apt-get update && apt-get install -y \
    ruby-full \
    build-essential \
    zlib1g-dev \
    git \
    && echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc \
    && echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc \
    && . ~/.bashrc

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Clone the GitHub repository
COPY . /srv/jekyll

# Set working directory
WORKDIR /srv/jekyll

# Create Gemfile
RUN echo 'source "https://rubygems.org"' > Gemfile \
    && echo 'gem "jekyll"' >> Gemfile

# Expose port 4000 for Jekyll server
EXPOSE 4000

# Set the entrypoint to run Jekyll serve
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

#################################

# docker build -t jekyll-site .
# docker run --rm -p 4000:4000 jekyll-site
# http://localhost:4000
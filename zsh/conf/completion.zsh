# do not autoselect the first completion entry
unsetopt menu_complete

unsetopt flowcontrol
setopt auto_menu

# show completion menu on succesive tab press
setopt complete_in_word
setopt always_to_end

zmodload -i zsh/complist

zstyle ':completion:*' insert-tab false

bindkey -M menuselect '^o' accept-and-infer-next-history
zstyle ':completion:*:*:*:*:*' menu select

zstyle ':completion:*:cd:*' tag-order local-directories directory-stack path-directories
cdpath=(.)

zstyle ':completion::complete:*' use-cache 1
zstyle ':completion::complete:*' cache-path /tmp/cache/

## Completions
#autoload -Uz compinit
#compinit
#
autoload compinit; compinit

## case-insensitive (all),partial-word and then substring completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' \
    'r:|[._-]=* r:|=*' 'l:|=* r:|=*'

setopt correctall

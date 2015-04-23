# allow the use of the Home/End keys
bindkey "\e[1~" beginning-of-line
bindkey "\e[4~" end-of-line

# allow the use of the Delete/Insert keys
bindkey "\e[3~" delete-char
bindkey "\e[2~" quoted-insert

# alternate mappings for "page up" and "page down" to search the history
bindkey "\e[5~" history-search-backward
bindkey "\e[6~" history-search-forward

# mappings for Ctrl-left-arrow and Ctrl-right-arrow for word moving
bindkey "\e[1;5C" forward-word
bindkey "\e[1;5D" backward-word
bindkey "\e[5C" forward-word
bindkey "\e[5D" backward-word
bindkey "\e\e[C" forward-word
bindkey "\e\e[D" backward-word

set completion-ignore-case on

# set mark-symlinked-directories on

# set show-all-if-ambiguous on

# Control-j: menu-complete
# Control-k: menu-complete-backward

# set completion-prefix-display-length 2


# bindkey -v
# bindkey '\e[3~' delete-char
# bindkey '^R' history-incremental-search-backward

bindkey -e
bindkey '\ew' kill-region
bindkey -s '\el' "ls\n"
bindkey '^r' history-incremental-search-backward
bindkey "^[[5~" up-line-or-history
bindkey "^[[6~" down-line-or-history

# make search up and down work, so partially type and hit up/down to find relevant stuff
bindkey '^[[A' up-line-or-search
bindkey '^[[B' down-line-or-search

bindkey "^[[H" beginning-of-line
bindkey "^[[1~" beginning-of-line
bindkey "^[OH" beginning-of-line
bindkey "^[[F"  end-of-line
bindkey "^[[4~" end-of-line
bindkey "^[OF" end-of-line

bindkey ' ' magic-space

# Make the delete key (or Fn + Delete on the Mac) work instead of outputting a ~
bindkey '^?' backward-delete-char
bindkey "^[[3~" delete-char
bindkey "^[3;5~" delete-char
bindkey "\e[3~" delete-char

autoload -U edit-command-line
zle -N edit-command-line
bindkey '\C-x\C-e' edit-command-line

# rename using previous word
bindkey "^[m" copy-prev-shell-word

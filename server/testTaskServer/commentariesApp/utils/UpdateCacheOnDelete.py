
# Нужно написать алгоритм который бы удалял кеш 
# Пример - удалили самое последнее сообщение (Старое) - будет смещение на 1 сообщение на каждой странице
# Значит придётся очистить весь кеш
# При удалении в середине сообщения впереди от страницы не сдвинутся, т.е если сообщение удалили на странице 
# 20 - сообщения на странице - 21 не изменятся, но изменятся на 19,18,17,16 ... 3,2,1